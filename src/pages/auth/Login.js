import React, { useState } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import { Form, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../App";
import { useMutation } from "react-query";
import { LoginApi } from "../../services/auths/service";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../state/slices/authreducer";
import toast from "react-hot-toast";
import { setTransferPassCode } from "../../state/slices/globalreducer";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const dispatch = useDispatch();
  const loginMutation = useMutation(LoginApi);
  // const navigate = useNavigate();
  const { errors, register, handleSubmit, getValues } = useForm();
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFormSubmit = async () => {
    setLoading(true);
    dispatch(setTransferPassCode(formdata.password));
    try {
      const payload = {
        email: formdata.email,
        password: formdata.password,
      };
      const res = await loginMutation.mutateAsync(payload);
      if (res) {
        // localStorage.setItem("accessToken", "token");
        dispatch(setToken(res?.access_token));
        dispatch(setUser(res?.user));
        toast.success(res?.message);
        console.log(res);

        setTimeout(() => {
          window.history.pushState(
            `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`,
            "auth-login",
            `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`
          );
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      toast.error(res?.error?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  // const onFormSubmit = (formData) => {
  //   setLoading(true);
  //   // Http request to Register New user
  //   (async () => {
  //     const res = await fetch(`${BASE_URL}/users/auth/login`, {
  //       body: {
  //         email: formData.name,
  //         password: formData.passcode,
  //       },
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (res.ok) {
  //       localStorage.setItem("accessToken", "token");
  //       setTimeout(() => {
  //         window.history.pushState(
  //           `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`,
  //           "auth-login",
  //           `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`
  //         );
  //         window.location.reload();
  //       }, 2000);
  //     } else {
  //       setTimeout(() => {
  //         setError("Cannot login with credentials");
  //         setLoading(false);
  //       }, 2000);
  //     }
  //   })();
  // };

  // const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Login" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
            </Link>
          </div>

          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4">Sign-In</BlockTitle>
                <BlockDes>
                  <p>Access Dashboard using your email and passcode.</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            {errorVal && (
              <div className="mb-3">
                <Alert color="danger" className="alert-icon">
                  {" "}
                  <Icon name="alert-circle" /> Unable to login with credentials{" "}
                </Alert>
              </div>
            )}
            <Form className="is-alter" onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="form-group">
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Email or Username
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    id="default-01"
                    name="email"
                    value={formdata.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="form-control-lg form-control"
                  />
                  {errors.name && <span className="invalid">{errors.name.message}</span>}
                </div>
              </div>
              <div className="form-group">
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                    Forgot Password?
                  </Link>
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassState(!passState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={passState ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formdata.password}
                    onChange={handleInputChange}
                    placeholder="Enter your passcode"
                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                  />
                  {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                </div>
              </div>
              <div className="form-group">
                <Button size="lg" className="btn-block" type="submit" color="primary">
                  {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
                </Button>
              </div>
            </Form>
            <div className="form-note-s2 text-center pt-4">
              {" "}
              New on our platform? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
            </div>
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Login;
