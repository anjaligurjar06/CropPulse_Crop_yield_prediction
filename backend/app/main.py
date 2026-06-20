from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.agronomy import CROPS, FERTILIZERS, IRRIGATION, PESTICIDE, SEASONS, SOIL_TYPES
from app.config import CORS_ORIGINS, MODEL_PATH
from app.predictor import YieldPredictor, fallback_predict
from app.schemas import PredictionRequest, PredictionResponse

predictor: YieldPredictor | None = None
using_ml = False


@asynccontextmanager
async def lifespan(_: FastAPI):
    global predictor, using_ml
    if MODEL_PATH.exists():
        predictor = YieldPredictor()
        using_ml = True
    else:
        predictor = None
        using_ml = False
    yield


app = FastAPI(
    title="CropPlus API",
    description="Machine learning crop yield prediction backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name": "CropPlus API",
        "status": "running",
        "ml_model_loaded": using_ml,
    }


@app.get("/health")
def health():
    return {"status": "ok", "ml_model_loaded": using_ml}


@app.get("/options")
def get_options():
    return {
        "crops": CROPS,
        "seasons": SEASONS,
        "soilTypes": SOIL_TYPES,
        "fertilizers": FERTILIZERS,
        "irrigation": IRRIGATION,
        "pesticide": PESTICIDE,
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if request.crop not in CROPS:
        raise HTTPException(status_code=422, detail=f"Unknown crop: {request.crop}")
    if request.season not in SEASONS:
        raise HTTPException(status_code=422, detail=f"Unknown season: {request.season}")
    if request.soilType not in SOIL_TYPES:
        raise HTTPException(status_code=422, detail=f"Unknown soil type: {request.soilType}")
    if request.fertilizer not in FERTILIZERS:
        raise HTTPException(status_code=422, detail=f"Unknown fertilizer: {request.fertilizer}")
    if request.irrigation not in IRRIGATION:
        raise HTTPException(status_code=422, detail=f"Unknown irrigation: {request.irrigation}")
    if request.pesticide not in PESTICIDE:
        raise HTTPException(status_code=422, detail=f"Unknown pesticide level: {request.pesticide}")

    try:
        if predictor is not None:
            return predictor.predict(request)
        return fallback_predict(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
