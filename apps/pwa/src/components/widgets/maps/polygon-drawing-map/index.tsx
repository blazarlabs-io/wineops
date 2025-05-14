import { Coordinates } from "@/models/types/db";
import { ControlPosition, Map, MapControl } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { UndoRedoControl } from "./undo-redo-control";
import { useDrawingManager } from "./use-drawing-manager";

export type PolygonDrawingMapProps = {
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

  // const [coordinates, setCoordinates] = useState<Coordinates[]>([]);

  useEffect(() => {
    if (!drawingManager) return;

    // * Listener for polygoncomplete
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

  useEffect(() => {
    if (initialCoordinates !== undefined && initialCoordinates.length > 0) {
      // TODO: draw polygon from initialCoordinates
    }
  }, [initialCoordinates]);

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
        defaultCenter={{ lat: 47.0110011447989, lng: 28.85266615038058 }} // Chisinau, Moldova
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapTypeId={"satellite"}
      />
      <MapControl position={ControlPosition.TOP_CENTER}>
        <UndoRedoControl drawingManager={drawingManager} />
      </MapControl>
    </>
  );
}
