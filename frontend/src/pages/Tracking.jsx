//CSS
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-dark-purple/theme.css";
import "primereact/resources/primereact.css";
import "../css/Tracking.css";

// REACT \ ROUTER
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// PRIMEREACT COMPONENTS
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Timeline } from "primereact/timeline";
import { Chip } from "primereact/chip";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";

// CUSTOM COMPONENTS
import Language from "../components/Language";

// CUSTOM FUNCTIONS
import { translate } from "../utils/language";
import { displayPopup } from "../utils/popup";
import { logout } from "../api/userAPI";
import { removeToken } from "../utils/localStorage";
import {
  getParcels,
  getEvents,
  addParcel,
  updateParcel,
  removeParcel,
} from "../api/parcelAPI";
const Tracking = () => {

  //Navigation
  const navigate = useNavigate();

  //Toast
  const toast = useRef(null);

  //States
  const [trackingNumber, setTrackingNumber] = useState("");
  const [newTrackingNumber, setNewTrackingNumber] = useState("");
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");

  const [parcels, setParcels] = useState([]);
  const [activeParcelIndex, setActiveParcelIndex] = useState(null);
  const [language, setLanguage] = useState();

  //UseEffect
  useEffect(() => {
    getParcels()
      .then((res) => {
        setParcels(res.data.data);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          navigate("/post/");
        }
      });
  }, [language]);


  //Handlers
  const handleAddParcel = () => {
    addParcel(name, trackingNumber)
      .then((res) => {
        if (res.data.type === "error") {
          displayPopup(toast, "error", translate(res.data.data), "");
          return;
        }
        setActiveParcelIndex(null);
        setParcels(res.data.data);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          navigate("/post/");
        }
      });
  };

  const handleChangeActiveParcelIndex = (e) => {
    setActiveParcelIndex(e.index);
    if (e.index != null) {
      if (!("events" in parcels[e.index])) {
        getEvents(parcels[e.index].number, language).then((res) => {
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
    let currentParcel = parcels[activeParcelIndex];
    if (
      currentParcel.name !== newName ||
      currentParcel.number !== newTrackingNumber
    ) {
      updateParcel(currentParcel.PK_parcel, newName, newTrackingNumber)
        .then((res) => {
          if (res.data.type === "error") {
            displayPopup(toast, "success", translate(res.data.data), "");
            return;
          }

          if (currentParcel.name !== newName) {
            setParcels(
              parcels.map((parcel, index) => {
                if (index === activeParcelIndex) {
                  parcel.name = newName;
                }
                return parcel;
              })
            );
            displayPopup(
              toast,
              "success",
              translate("EDIT_PARCEL_SUCCESS"),
              ""
            );

            return;
          }

          getEvents(newTrackingNumber, language).then((res) => {
            setParcels(
              parcels.map((parcel, index) => {
                if (index === activeParcelIndex) {
                  parcel.name = newName;
                  parcel.number = newTrackingNumber;
                  parcel.events = res.data.data;
                }
                return parcel;
              })
            );
            setNewTrackingNumber(currentParcel.number);
            displayPopup(
              toast,
              "success",
              translate("EDIT_PARCEL_SUCCESS"),
              ""
            );
          });
        })
        .catch((err) => {
          if (err.response.status === 403) {
            navigate("/post/");
          }
        });
    }
  };

  const handleRemoveParcel = (event, PK_parcel) => {
    confirmPopup({
      target: event.currentTarget,
      message: translate("REMOVE_PARCEL"),
      acceptLabel: translate("YES"),
      rejectLabel: translate("NO"),
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        removeParcel(PK_parcel).then((res) => {
          if (res.data.type === "error") {
            displayPopup(toast, "error", translate(res.data.data), "");
            return;
          }
          setParcels(
            parcels.filter((parcel) => parcel.PK_parcel !== PK_parcel)
          );
          setActiveParcelIndex(null);
          displayPopup(
            toast,
            "success",
            translate("REMOVE_PARCEL_SUCCESS"),
            ""
          );
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

  const handleLanguageChange = (e) => {
    setLanguage(e);
    setActiveParcelIndex(null);
  };

  return (
    <div>
      <div className="col-12 text-end">
        <Button
          className="p-button-text p-button-sm mx-5"
          label={translate("LOGOUT")}
          onClick={handleLogout}
        />
        <Language onLanguageChange={handleLanguageChange} />
      </div>
      <Toast ref={toast} />
      <div className="row justify-content-center mb-4">
        <div className="col-8">
          <h1 className="text-light text-center">{translate("MY_PARCELS")}</h1>
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
                  <label htmlFor="name">{translate("PARCEL_NAME")}</label>
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
                  <label htmlFor="trackingNumber">
                    {translate("PARCEL_NUMBER")}
                  </label>
                </span>
              </div>
              <div className="col-4">
                <Button
                  label={translate("ADD_PARCEL")}
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
              activeIndex={activeParcelIndex}
              onTabChange={handleChangeActiveParcelIndex}
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
                        <InplaceDisplay>
                          {translate("EDIT_PARCEL_NAME")}
                        </InplaceDisplay>
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
                        <InplaceDisplay>
                          {translate("EDIT_PARCEL_NUMBER")}
                        </InplaceDisplay>
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
