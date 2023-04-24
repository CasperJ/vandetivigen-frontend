import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from "axios";
import * as d3 from "d3";
import './App.css';
import { Record } from "./Record";
import Chart from './Chart';
import Map from './Map';

interface AppProps { }
interface AppState {
  isSensorDataLoaded: boolean;
  temperatureReadings?: Record[];
}
class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = { isSensorDataLoaded: false };
  }

  componentDidMount() {
    this.getSensorData();
  }

  async getSensorData() {
      const readings : Record[] = [
        { RecordedOn: new Date(2023, 4,1,12,0,0), Temperature: 10.8, Temperature2: 11.8 },
        { RecordedOn: new Date(2023, 4,1,13,0,0), Temperature: 11.8, Temperature2: 11.7 },
        { RecordedOn: new Date(2023, 4,1,14,0,0), Temperature: 12.8, Temperature2: 11.4 },
        { RecordedOn: new Date(2023, 4,1,15,0,0), Temperature: 11.8, Temperature2: 11.2 },
        { RecordedOn: new Date(2023, 4,1,16,0,0), Temperature: 10.8, Temperature2: 11.8 },
      ];
      this.setState({ isSensorDataLoaded: true, temperatureReadings: readings }); 

    // const sensorData = await axios.get<{ RecordedOn: string, Temperature: number, Temperature2: number }[]>("/api/temperature");
    // if (sensorData.status === 200) {
    //   const timeFormatter = d3.utcParse("%Y-%m-%dT%H:%M:%S.%L%Z");
    //   const readings = sensorData.data.map(d => { return { RecordedOn: timeFormatter(d.RecordedOn) || new Date(), Temperature: d.Temperature, Temperature2: d.Temperature2 }; })
    //   this.setState({ isSensorDataLoaded: true, temperatureReadings: readings }); 
    // }

  }

  render() {
    //const reading : Record = {RecordedOn: new Date(), Temperature: 19.7, Temperature2: 20.8};
    const reading = this.state.isSensorDataLoaded && this.state.temperatureReadings ? this.state.temperatureReadings[0] : null;
    return (
      <Container fluid="md">
        <Row className="top-spacing"></Row>
        <Row className="justify-content-md-center">
          <Col lg="8" md="8" sm="12" xs="12" className="AppCard">
            <h1>Havnevigen</h1>
            <Map reading={reading}></Map>
            <div className="ChartContainer">
              {this.state.isSensorDataLoaded && this.state.temperatureReadings && <Chart records={this.state.temperatureReadings} ></Chart>}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
