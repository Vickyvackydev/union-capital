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
import { Spinner } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../App";
import { RegisterApi } from "../../services/auths/service";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../state/slices/authreducer";
import toast from "react-hot-toast";

const Register = ({ history }) => {
  const [passState, setPassState] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUser);
  const { errors, register, handleSubmit, getValues } = useForm();
  const registerMutation = useMutation(RegisterApi);
  const [formdata, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    referred_by: "",
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
    try {
      const payload = {
        full_name: formdata.full_name,
        email: formdata.email,
        password: formdata.password,
        referred_by: "",
      };
      const res = await RegisterApi(payload);
      if (res) {
        dispatch(setUser(res?.data));
        toast.success(res?.message);
        // setTimeout(() => history.push(`${process.env.PUBLIC_URL}/auth-success`), 2000);
        setTimeout(() => history.push(`${process.env.PUBLIC_URL}/otp-verification`), 4000);
      }
    } catch (error) {
      toast.error(res?.error?.data?.message || res?.message);
    } finally {
      setLoading(false);
    }
  };

  console.log(userDetails);

  // const handleFormSubmit = () => {
  //   setLoading(true);
  //   const formData = getValues();
  //   console.log(formData);
  //   (async () => {
  //     const res = await fetch(`${BASE_URL}/users`, {
  //       body: JSON.stringify({
  //         email: formData["email"],
  //         password: formData["passcode"],
  //       }),
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (res.ok) {
  //       setTimeout(() => history.push(`${process.env.PUBLIC_URL}/auth-success`), 2000);
  //       setTimeout(() => history.push(`${process.env.PUBLIC_URL}/auth-login`), 4000);
  //     }
  //   })();
  // };
  return (
    <React.Fragment>
      <Head title="Register" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
            </Link>
          </div>
          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4">Register</BlockTitle>
                <BlockDes>
                  <p>Create New Account</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            <form className="is-alter" onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    id="name"
                    name="full_name"
                    value={formdata.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="form-control-lg form-control"
                  />
                  {errors.name && <p className="invalid">This field is required</p>}
                </div>
              </div>
              <div className="form-group">
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Email or Username
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    bssize="lg"
                    id="default-01"
                    name="email"
                    value={formdata.email}
                    onChange={handleInputChange}
                    className="form-control-lg form-control"
                    placeholder="Enter your email address or username"
                  />
                  {errors.email && <p className="invalid">This field is required</p>}
                </div>
              </div>
              <div className="form-group">
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    Passcode
                  </label>
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
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Referred by
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    bssize="lg"
                    id="default-01"
                    name="email"
                    value={formdata.referred_by}
                    onChange={handleInputChange}
                    className="form-control-lg form-control"
                    placeholder="Enter your email address or username"
                  />
                </div>
              </div>
              <div className="form-group">
                <Button type="submit" color="primary" size="lg" className="btn-block">
                  {loading ? <Spinner size="sm" color="light" /> : "Register"}
                </Button>
              </div>
            </form>
            <div className="form-note-s2 text-center pt-4">
              {" "}
              Already have an account?{" "}
              <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                <strong>Sign in instead</strong>
              </Link>
            </div>
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Register;
