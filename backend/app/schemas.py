from pydantic import BaseModel, ConfigDict, Field


class PredictionRequest(BaseModel):
    crop: str
    season: str
    soilType: str = Field(alias="soilType")
    area: float = Field(gt=0, description="Area in hectares")
    temperature: float = Field(ge=-10, le=60)
    rainfall: float = Field(ge=0)
    humidity: float = Field(ge=0, le=100)
    fertilizer: str
    irrigation: str
    pesticide: str

    model_config = ConfigDict(populate_by_name=True)


class Metrics(BaseModel):
    waterAdequacy: int
    tempSuitability: int
    soilScore: int
    inputEfficiency: int


class PredictionResponse(BaseModel):
    totalYield: str
    outlook: str
    metrics: Metrics
    tip: str
    yieldPerHa: float
