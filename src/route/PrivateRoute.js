import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Store } from "../state/store";
import { useSelector } from "react-redux";
import { selectToken } from "../state/slices/authreducer";

const PrivateRoute = ({ exact, component: Component, ...rest }) => {
  const token = useSelector(selectToken);
  // const auth = Store.getState().auths.token;
  return (
    <Route
      exact={exact ? true : false}
      rest
      render={(props) =>
        token ? (
          <Component {...props} {...rest}></Component>
        ) : (
          <Redirect to={`${process.env.PUBLIC_URL}/auth-login`}></Redirect>
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
