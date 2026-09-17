import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    ml_api_key: str
    port: int

    def __init__(self) -> None:
        key = os.environ.get("ML_API_KEY")
        if not key:
            raise RuntimeError("ML_API_KEY environment variable is required")
        self.ml_api_key = key
        self.port = int(os.environ.get("PORT", "8000"))


settings = Settings()
