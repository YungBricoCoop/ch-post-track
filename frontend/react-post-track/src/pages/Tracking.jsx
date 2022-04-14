import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-dark-purple/theme.css";
import "primereact/resources/primereact.css";
import "../css/Tracking.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/userAPI";
import { removeToken } from "../utils/tokenStorage";

import {
  getParcels,
  getEvents,
  addParcel,
  updateParcel,
  removeParcel,
} from "../api/parcelAPI";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Timeline } from "primereact/timeline";
import { Chip } from "primereact/chip";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { confirmPopup } from "primereact/confirmpopup";
import { Tag } from "primereact/tag";

import displayPopup from "../utils/popup";

import { Toast } from "primereact/toast";

const Tracking = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [trackingNumber, setTrackingNumber] = useState("");
  const [newTrackingNumber, setNewTrackingNumber] = useState("");

  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");

  const [parcels, setParcels] = useState([]);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(null);
  const headerSpace = 30;

  useEffect(() => {
    getParcels()
      .then((res) => {
        setParcels(res.data.data);
      })
      .catch((err) => {
        if (err.response.status == 403) {
          navigate("/post/");
        }
      });
  }, []);

  const handleAddParcel = () => {
    addParcel(name, trackingNumber)
      .then((res) => {
        if (res.data.type === "error") {
          displayPopup(toast, "error", "", res.data.data);
          return;
        }
        setActiveAccordionIndex(null);
        setParcels(res.data.data);
      })
      .catch((err) => {
        if (err.response.status == 403) {
          navigate("/post/");
        }
      });
  };

  const handleChangeAccordionIndex = (e) => {
    setActiveAccordionIndex(e.index);
    if (e.index != null) {
      if (!("events" in parcels[e.index])) {
        getEvents(parcels[e.index].number).then((res) => {
          setParcels(
            parcels.map((parcel, index) => {
              if (index === e.index) {
                parcel.events = res.data.data;
              }
              return parcel;
            })
          );
          setNewName(parcels[e.index].name);
          setNewTrackingNumber(parcels[e.index].number);
        });
      }
    }
  };

  const handleInplaceClose = (e) => {
    let currentParcel = parcels[activeAccordionIndex];
    if (
      currentParcel.name !== newName ||
      currentParcel.number !== newTrackingNumber
    ) {
      updateParcel(currentParcel.PK_parcel, newName, newTrackingNumber)
        .then((res) => {
          if (res.data.type === "error") {
            displayPopup(toast, "error", "Parcel", res.data.data);
            return;
          }
          displayPopup(toast, "success", "Parcel", "Updated successfully");
          setParcels(
            parcels.map((parcel, index) => {
              if (index === activeAccordionIndex) {
                parcel.name = newName;
                parcel.number = newTrackingNumber;
              }
              return parcel;
            })
          );
        })
        .catch((err) => {
          if (err.response.status == 403) {
            navigate("/post/");
          }
        });
    }
  };

  const handleRemoveParcel = (event, PK_parcel) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Are you sure you want to delete this parcel?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        removeParcel(PK_parcel).then((res) => {
          if (res.data.type === "error") {
            displayPopup(toast, "error", "Parcel", res.data.data);
            return;
          }
          setParcels(
            parcels.filter((parcel) => parcel.PK_parcel !== PK_parcel)
          );
          setActiveAccordionIndex(null);
          displayPopup(toast, "success", "Parcel", "Updated successfully");
        });
      },
      reject: () => {},
    });
  };

  const handleLogout = () => {
    logout().then((res) => {
      removeToken();
      navigate("/post/");
    });
  };

  return (
    <div>
      <div className="col-12 text-end">
        <Button
          className="p-button-outlined p-button-rounded p-button-sm"
          label="Logout"
          onClick={handleLogout}
        />
      </div>
      <Toast ref={toast} />
      <div className="row justify-content-center mb-4">
        <div className="col-8">
          <h1 className="text-light text-center">CH Post Track</h1>
        </div>
      </div>
      <div className="row justify-content-center mb-4">
        <div className="col-8">
          <Card>
            <div className="row">
              <div className="col-4">
                <span className="p-float-label">
                  <InputText
                    className="w-100"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor="name">Name</label>
                </span>
              </div>
              <div className="col-4">
                <span className="p-float-label">
                  <InputText
                    className="w-100"
                    id="trackingNumber"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <label htmlFor="trackingNumber">Tracking Number</label>
                </span>
              </div>
              <div className="col-4">
                <Button
                  label="Add"
                  icon="pi pi-plus-circle"
                  iconPos="right"
                  onClick={handleAddParcel}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-8">
          <Card>
            <Accordion
              activeIndex={activeAccordionIndex}
              onTabChange={handleChangeAccordionIndex}
            >
              {parcels.map((parcel, index) => (
                <AccordionTab
                  key={index}
                  className="custom-accordion-tab"
                  header={
                    <div className="row">
                      <div className="col-5">
                        <Chip label={parcel.name} icon="pi pi-tags" />
                      </div>
                      <div className="col-5">
                        <Chip label={parcel.number} icon="pi pi-box" />
                      </div>
                      <div className="col-2 text-center">
                        <Button
                          icon="pi pi-times"
                          className="p-button-sm"
                          onClick={(e) =>
                            handleRemoveParcel(e, parcel.PK_parcel)
                          }
                        />
                      </div>
                    </div>
                  }
                >
                  <Timeline
                    value={parcel.events}
                    opposite={(item) => (
                      <>
                        {item.eventName} <br />
                        <small className="p-text-secondary">
                          {" "}
                          {item.city}{" "}
                        </small>
                      </>
                    )}
                    content={(item) => (
                      <small className="p-text-secondary">
                        {item.timestamp}
                      </small>
                    )}
                  />

                  <div className="row mt-5">
                    <div className="col-6 text-center">
                      <Inplace closable onClose={handleInplaceClose}>
                        <InplaceDisplay>Edit parcel name</InplaceDisplay>
                        <InplaceContent>
                          <InputText
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            autoFocus
                          />
                        </InplaceContent>
                      </Inplace>
                    </div>
                    <div className="col-6 text-center">
                      <Inplace closable onClose={handleInplaceClose}>
                        <InplaceDisplay>Edit parcel number</InplaceDisplay>
                        <InplaceContent>
                          <InputText
                            value={newTrackingNumber}
                            onChange={(e) =>
                              setNewTrackingNumber(e.target.value)
                            }
                            autoFocus
                          />
                        </InplaceContent>
                      </Inplace>
                    </div>
                  </div>
                </AccordionTab>
              ))}
            </Accordion>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
