import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-dark-purple/theme.css";
import "primereact/resources/primereact.css";

import { useEffect, useState } from "react";

import { getEvents } from "../api/postAPI";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Fieldset } from "primereact/fieldset";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Timeline } from 'primereact/timeline';

import { convertTimeStampToDate } from "../utils/date";

const events = [
  { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
  { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
  { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
  { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
];



const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [collapsed, setCollapsed] = useState(true);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    getEvents("LS404058506CH").then((res) => {
      setEvents(res.data);
    });
  }, []);

  return (
    <div>
      <div className="row justify-content-center mb-4">
        <div className="col-6">
          <h1 className="text-light text-center">Post Track</h1>
        </div>
      </div>
      <div className="row justify-content-center mb-4">
        <div className="col-6">
          <Card>
            <div className="row">
              <div className="col-6">
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
              <div className="col-6">
                <Button label="Add" />
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-6">
          <Card>
            <Accordion>
              <AccordionTab header="LS404058506CH">
              <Timeline value={events} opposite={(item) => item.eventCode} content={(item) => <small className="p-text-secondary">{convertTimeStampToDate(item.timestamp)}</small>} />

              </AccordionTab>
              <AccordionTab header="Header II">Content II</AccordionTab>
              <AccordionTab header="Header III">Content III</AccordionTab>
            </Accordion>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
