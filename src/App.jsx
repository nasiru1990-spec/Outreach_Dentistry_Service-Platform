import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Map from "./components/Map/Map";
import Messaging from "./components/Messaging/Messaging";
import ServiceRequests from "./components/ServiceRequests/ServiceRequests";
import "./App.css";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute path="/map" component={Map} />
          <PrivateRoute path="/messaging" component={Messaging} />
          <PrivateRoute path="/service-requests" component={ServiceRequests} />
        </Switch>
      </div>
    </Router>
  );
}

function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default App;
