/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPolygonCenter } from "@/helpers/map-helpers";
import { Coordinates } from "@/models/types/db";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

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

    // Cleanup on unmount
    return () => {
      // polygon.setMap(null);
    };
  }, [map]);

  return null;
};

export type PolygonViewerMapProps = {
  height?: string;
  initialCoordinates: Coordinates[];
};

export default function PolygonViewerMap({
  height = "320px",
  initialCoordinates,
}: PolygonViewerMapProps) {
  const [center, setCenter] = useState<Coordinates>({
    lat: 47.010140941739486,
    lng: 28.86401035597581,
  });
  const [polygon, setPolygon] = useState<Coordinates[] | null>(null);

  // * lets validate initialCoordinates
  useEffect(() => {
    if (
      initialCoordinates === undefined ||
      initialCoordinates === null ||
      initialCoordinates.length < 3
    ) {
      setCenter({ lat: 47.010140941739486, lng: 28.86401035597581 });
      setPolygon(null);
    } else {
      setCenter(getPolygonCenter(initialCoordinates));
      setPolygon(initialCoordinates);
    }
  }, [initialCoordinates]);

  return (
    <Map
      style={{
        width: "100%",
        height: height,
        borderRadius: "8px",
        overflow: "hidden",
      }}
      defaultCenter={center}
      defaultZoom={12}
      id="my-map"
      disableDefaultUI={true}
      mapTypeId={"hybrid"}
    >
      {initialCoordinates !== undefined &&
        initialCoordinates !== null &&
        initialCoordinates.length > 2 && (
          <PolygonOverlay initialCoordinates={polygon as Coordinates[]} />
        )}
    </Map>
  );
}
