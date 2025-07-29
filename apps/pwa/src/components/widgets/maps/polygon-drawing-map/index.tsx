
import { Coordinates } from "@/models/types/db";
import {
  ControlPosition,
  Map,
  MapControl,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { UndoRedoControl } from "./undo-redo-control";
import { useDrawingManager } from "./use-drawing-manager";

function getPolygonCenter(coordinates: Coordinates[]): Coordinates {
  const numPoints = coordinates.length;
  if (numPoints === 0) throw new Error("No coordinates provided.");

  let sumLat = 0;
  let sumLng = 0;

  for (const coord of coordinates) {
    sumLat += coord.lat;
    sumLng += coord.lng;
  }

  return {
    lat: sumLat / numPoints,
    lng: sumLng / numPoints,
  };
}

interface PolygonOverlayProps {
  height?: string;
  initialCoordinates?: Coordinates[];
  onChange?: (position: Coordinates) => void;
}

const PolygonOverlay = ({ initialCoordinates }: PolygonOverlayProps) => {
  const map = useMap();
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map || polygonRef.current || !initialCoordinates) return;

    const polygon = new google.maps.Polygon({
      paths: initialCoordinates as any,
      strokeColor: "#C8446A",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#C8446A",
      fillOpacity: 0.35,
    });

    polygon.setMap(map);
    polygonRef.current = polygon;

    return () => {
    };
  }, [map]);

  return null;
};

type PolygonDrawingMapProps = {
  height?: string;
  initialCoordinates?: Coordinates[];
  onComplete?: (coordinates: Coordinates[]) => void;
};

export default function PolygonDrawingMap({
  height = "320px",
  initialCoordinates,
  onComplete,
}: PolygonDrawingMapProps = {}) {
  const drawingManager = useDrawingManager();

  useEffect(() => {
    if (!drawingManager) return;

    const polygonCompleteListener = drawingManager.addListener(
      "polygoncomplete",
      async (polygon: google.maps.Polygon) => {
        const polygonArray = polygon.getPath().getArray();
        const coordinates: Coordinates[] = await polygonArray.map(
          (coordinate) => {
            return coordinate.toJSON();
          }
        );
        if (onComplete) onComplete(coordinates);
      }
    );
    return () => {
      polygonCompleteListener.remove();
    };
  }, [drawingManager]);

  return (
    <>
      <Map
        style={{
          width: "100%",
          height: height,
          borderRadius: "8px",
          overflow: "hidden",
        }}
        defaultZoom={13}
        defaultCenter={
          initialCoordinates && initialCoordinates.length > 0
            ? getPolygonCenter(initialCoordinates)
            : { lat: 47.0110011447989, lng: 28.85266615038058 }
        } // Chisinau, Moldova
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapTypeId={"hybrid"}
      />
      {initialCoordinates && initialCoordinates.length > 0 && (
        <PolygonOverlay initialCoordinates={initialCoordinates} />
      )}
      <MapControl position={ControlPosition.TOP_CENTER}>
        <UndoRedoControl drawingManager={drawingManager} />
      </MapControl>
    </>
  );
}
