import React, { useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import {
  Drawer,
  useMediaQuery,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@material-ui/core";

function GMap({ google, organisations }) {
  const [orgMarkers, setOrgMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const isMobile = useMediaQuery("(max-width: 480px)");

  function handleClick(clickedMarker) {
    if (selectedMarker === clickedMarker) {
      // Clicked marker is already bouncing, stop its animation
      setSelectedMarker(null);
      clickedMarker.setAnimation(null);
    } else {
      // Stop animation on the previously bouncing marker (if any)
      if (selectedMarker) {
        selectedMarker.setAnimation(null);
      }
      // Start animation on the clicked marker
      setSelectedMarker(clickedMarker);
      clickedMarker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  function handleCloseDrawer() {
    selectedMarker.setAnimation(null);
    setSelectedMarker(null);
  }

  useEffect(() => {
    const geocoder = new google.maps.Geocoder();

    // Geocode each organisation's address with a delay between markers
    organisations.forEach((organisation, index) => {
      setTimeout(() => {
        geocoder.geocode(
          { address: organisation.address },
          (results, status) => {
            if (status === "OK") {
              const location = results[0].geometry.location;

              const marker = {
                organisation: organisation,
                position: { lat: location.lat(), lng: location.lng() },
              };
              setOrgMarkers((prevMarkers) => [...prevMarkers, marker]);
            } else {
              console.error("Geocoding failed:", status);
            }
          }
        );
      }, index * 250);
    });
  }, [google.maps.Geocoder]);

  return (
    <>
      <Map
        google={google}
        zoom={5}
        style={{ width: "100%", height: "100%" }}
        initialCenter={{ lat: 45.815399, lng: 15.966568 }}
      >
        {orgMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.organisation.name}
            orgInfo={marker.organisation}
            onClick={(props, marker) => handleClick(marker)}
            animation={window.google.maps.Animation.DROP}
          />
        ))}
      </Map>

      {selectedMarker && (
        <Drawer
          anchor={isMobile ? "bottom" : "left"}
          open={selectedMarker !== null}
          onClose={handleCloseDrawer}
        >
          <div style={{ width: 300, maxHeight: 200, padding: 16 }}>
            <Typography variant="h4">{selectedMarker.orgInfo.name}</Typography>
            <List dense>
              <ListItem divider>
                <ListItemText
                  primary="Description"
                  secondary={selectedMarker.orgInfo.description}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Contact"
                  secondary={selectedMarker.orgInfo.contactName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Contact Email"
                  secondary={
                    <Link
                      href={`mailto:${selectedMarker.orgInfo.contactEmail}`}
                    >
                      {selectedMarker.orgInfo.contactEmail}
                    </Link>
                  }
                />
              </ListItem>
              <ListItem divider>
                <ListItemText
                  primary="Contact Telephone"
                  secondary={
                    <Link href={`tel:${selectedMarker.orgInfo.contactTel}`}>
                      {selectedMarker.orgInfo.contactTel}
                    </Link>
                  }
                />
              </ListItem>

              {selectedMarker.orgInfo.references && (
                <ListItem divider>
                  <ListItemText
                    primary="References"
                    secondary={selectedMarker.orgInfo.references}
                  />
                </ListItem>
              )}
              {selectedMarker.orgInfo.lookingFor && (
                <ListItem divider>
                  <ListItemText
                    primary="Looking for"
                    secondary={selectedMarker.orgInfo.lookingFor}
                  />
                </ListItem>
              )}

              <ListItem divider>
                <ListItemText
                  primary="Address"
                  secondary={selectedMarker.orgInfo.address}
                />
              </ListItem>

              {selectedMarker.orgInfo.webUrl && (
                <ListItem>
                  <ListItemText
                    primary="Website"
                    secondary={
                      <Link href={selectedMarker.orgInfo.webUrl}>
                        {selectedMarker.orgInfo.webUrl}
                      </Link>
                    }
                  />
                </ListItem>
              )}
              {selectedMarker.orgInfo.facebookUrl && (
                <ListItem>
                  <ListItemText
                    primary="Facebook"
                    secondary={
                      <Link href={selectedMarker.orgInfo.facebookUrl}>
                        {selectedMarker.orgInfo.facebookUrl}
                      </Link>
                    }
                  />
                </ListItem>
              )}
              {selectedMarker.orgInfo.instagramUrl && (
                <ListItem>
                  <ListItemText
                    primary="Instagram"
                    secondary={
                      <Link href={selectedMarker.orgInfo.instagramUrl}>
                        {selectedMarker.orgInfo.instagramUrl}
                      </Link>
                    }
                  />
                </ListItem>
              )}
              {selectedMarker.orgInfo.linkedInUrl && (
                <ListItem>
                  <ListItemText
                    primary="LinkedIn"
                    secondary={
                      <Link href={selectedMarker.orgInfo.linkedInUrl}>
                        {selectedMarker.orgInfo.linkedInUrl}
                      </Link>
                    }
                  />
                </ListItem>
              )}
            </List>
          </div>
        </Drawer>
      )}
    </>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAaCAGajZa5XI9XgOwsEM9sw2sxM0Oawkc",
})(GMap);
