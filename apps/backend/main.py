from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import osmnx as ox


class Coordinates(BaseModel):
    lon: float
    lat: float


class Location(BaseModel):
    origin: Coordinates
    destination: Coordinates


app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://iisc-assessment.vercel.app/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/paths')
def find_path(location: Location):
    try:
        place = "Bengaluru, Karnataka"
        G = ox.graph_from_place(place, network_type="drive")
        origin_node = ox.distance.nearest_nodes(G, location.origin.lon, location.origin.lat)
        dest_node = ox.distance.nearest_nodes(G, location.destination.lon, location.destination.lat)

        # Get the shortest path nodes
        path_nodes = ox.routing.shortest_path(G, origin_node, dest_node, weight="length")

        # Convert node IDs to coordinates
        path_coords = [[G.nodes[node]['y'], G.nodes[node]['x']] for node in path_nodes]

        return {
            "path": path_coords
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing pipeline: {str(e)}"
        )
