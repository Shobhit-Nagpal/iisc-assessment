from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import osmnx as ox

place = "Bengaluru, Karnataka"
G = ox.graph_from_place(place, network_type="drive")


class Coordinates(BaseModel):
    lon: float
    lat: float


class Location(BaseModel):
    origin: Coordinates
    destination: Coordinates


app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://iisc-assessment.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/paths')
def find_path(location: Location):
    try:
        origin_node = ox.distance.nearest_nodes(G, location.origin.lon, location.origin.lat)
        dest_node = ox.distance.nearest_nodes(G, location.destination.lon, location.destination.lat)

        # Get the shortest paths nodes
        k_path_nodes = ox.routing.k_shortest_paths(G, origin_node, dest_node, 3, weight="length")

        all_paths = []
        for path in k_path_nodes:
            path_coords = [[G.nodes[node]['y'], G.nodes[node]['x']] for node in path]
            all_paths.append(path_coords)

        # Convert node IDs to coordinates

        return {
            "paths": all_paths
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing pipeline: {str(e)}"
        )
