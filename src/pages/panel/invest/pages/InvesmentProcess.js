import React, { useState, useEffect } from "react";
import Nouislider from "nouislider-react";
import Content from "../../../../layout/content/Content";
import Head from "../../../../layout/head/Head";
import { pricingTableDataV1 } from "../data";
import { Link } from "react-router-dom";
import { addDays, dateFormatterAlt, returnCurrency, returnLevel } from "../../../../utils/Utils";
import {
  Button,
  Card,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import {
  BackTo,
  BlockHeadContent,
  BlockHeadSub,
  BlockTitle,
  BlockHead,
  Block,
  Icon,
} from "../../../../components/Component";
import { useSelector } from "react-redux";
import { selectPlan } from "../../../../state/slices/globalreducer";
import {
  GetPlans,
  GetUserWallet,
  GetWallets,
  GetWalletsByUserId,
  InvestmentApi,
  SubmitPaymentApi,
} from "../../../../services/service";
import { useMutation, useQuery } from "react-query";
import { selectUser } from "../../../../state/slices/authreducer";
import toast from "react-hot-toast";

const InvestmentProcess = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [createdInvestMent, setCreatedInvestMent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const [rangeVal, setRangVal] = useState("");
  const [sliderVal, setSliderVal] = useState(0);
  const [modal, setModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [wallet, setWallet] = useState({
    label: "NioWallet",
    value: "2.014095 BTC ( $18,934.84 )",
  });
  const user = useSelector(selectUser);
  const { data: user_wallet } = useQuery("wallet", GetUserWallet);
  const { data: plansData } = useQuery("plans", GetPlans);

  const [date, setDate] = useState("");
  const getSelectedPlan = useSelector(selectPlan);
  const isNotValid = () => {
    return rangeVal === "" || !isChecked;
  };
  const handleInvestMent = async () => {
    setLoading(true);
    const payload = {
      amount: Number(rangeVal),
      plan_id: getSelectedPlan?.id,
    };
    try {
      const response = await InvestmentApi(payload);
      if (response) {
        toast.success(response?.message, {
          duration: 10000,
        });
        setModal(false);
        setConfirmModal(true);
        setRangVal("");
        setIsChecked(!isChecked);
        setCreatedInvestMent(response?.data);
      }
    } catch (error) {
      console.error(error?.response?.data?.message); // Log detailed error
      toast.error(error?.response?.data?.message || error?.message); // Show error message
    } finally {
      setLoading(false);
    }
  };

  console.log(createdInvestMent);

  useEffect(() => {
    const today = new Date();
    const resultDate = new Date(today.setDate(today.getDate() + 45));

    const year = resultDate.getFullYear();
    const month = String(resultDate.getMonth() + 1).padStart(2, "0");
    const day = String(resultDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    setDate(formattedDate);
  }, []);

  // console.log(getSelectedPlan);

  // useEffect(() => {
  //   let foundEl = pricingTableDataV1.find((item) => item.id === match.params.id);
  //   if (foundEl) {
  //     setCurrentPlan(foundEl);
  //     setRangVal(Number(returnCurrency(currency, foundEl.minDeposit).value).toFixed(0));
  //     setSliderVal(returnCurrency(currency, foundEl.minDeposit).value);
  //   }
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   if (currentPlan) {
  //     if (currency !== "btc") {
  //       setRangVal(Number(returnCurrency(currency, currentPlan.minDeposit).value).toFixed(0));
  //     } else {
  //       setRangVal(Number(returnCurrency(currency, currentPlan.minDeposit).value).toFixed(6));
  //     }
  //     setSliderVal(returnCurrency(currency, currentPlan.minDeposit).value);
  //   }
  // }, [currentPlan]); // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   onValChange(rangeVal);
  // }, [rangeVal]);

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  // const calculateProfitReturns = (interest, term, principle) => {
  //   let value = Number(principle);
  //   let dailyProfit = value * (interest / 100);
  //   let totalNetProfit = dailyProfit * term;
  //   let totalReturn = totalNetProfit + value;

  //   return {
  //     dailyProfit: currency === "btc" ? dailyProfit.toFixed(6) : dailyProfit.toFixed(2),
  //     totalNetProfit: currency === "btc" ? totalNetProfit.toFixed(6) : totalNetProfit.toFixed(2),
  //     totalReturn: currency === "btc" ? totalReturn.toFixed(6) : totalReturn.toFixed(2),
  //   };
  // };

  // const calculateConversionFee = (value, fee) => {
  //   let invest = Number(value);
  //   let conversionFee = invest * (fee / 100);

  //   let totalFee = conversionFee + invest;

  //   return totalFee;
  // };

  // const onValChange = (val) => {
  //   let el = document.getElementById(`iv-amount-${Number(val).toFixed(0)}`);
  //   if (el) {
  //     el.click();
  //   }
  // };

  return (
    <React.Fragment>
      <Head title="Invest"></Head>

      <Content size="lg">
        <BlockHead>
          <BlockHeadContent>
            <BlockHeadSub>
              <BackTo icon="arrow-left" link={`/invest/invest`}>
                Back to plans
              </BackTo>
            </BlockHeadSub>
          </BlockHeadContent>
          <BlockHeadContent>
            <BlockTitle tag="h2" className="fw-normal">
              Ready to get started
            </BlockTitle>
          </BlockHeadContent>
        </BlockHead>

        <Block className="invest-block">
          <form className="invest-form">
            <Row className="g-gs">
              <Col lg="7">
                <div className="form-group invest-field">
                  <input type="hidden" defaultValue="silver" name="iv-plan" id="invest-choose-plan"></input>
                  <UncontrolledDropdown className="invest-cc-dropdown">
                    <a href="#toggle" onClick={() => {}} className="invest-cc-chosen dropdown-indicator">
                      <div className="coin-item">
                        <div className="coin-icon">
                          <Icon name="offer-fill" />
                        </div>
                        <div className="coin-info">
                          <span className="coin-name">{getSelectedPlan?.name} Plan</span>
                          <span className="coin-text">Invest for 30 days and get daily profit 5%</span>
                        </div>
                      </div>
                    </a>
                    <DropdownMenu className="dropdown-menu-auto dropdown-menu-mxh">
                      {plansData?.records?.map((item, index) => {
                        return (
                          <li
                            className={`invest-cc-item ${index === 1 ? "selected" : ""}`}
                            // onClick={() => {
                            //   setCurrentPlan({ ...item });
                            // }}
                            key={index}
                          >
                            <DropdownItem
                              tag="a"
                              href="#dropdown-item"
                              onClick={(ev) => {
                                ev.preventDefault();
                              }}
                              className="invest-cc-opt"
                            >
                              <div className="coin-item">
                                <div className="coin-icon">
                                  <Icon name="offer-fill"></Icon>
                                </div>
                                <div className="coin-info">
                                  <span className="coin-name">{item.name} Plan</span>
                                  <span className="coin-text">
                                    Invest for {item.duration_days} days and get daily profit {item.cumulative_profits}%
                                  </span>
                                </div>
                              </div>
                            </DropdownItem>
                          </li>
                        );
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <div className="form-group invest-field">
                  <div className="form-label-group">
                    <label className="form-label">Choose Quick Amount to Invest</label>
                  </div>
                  <div className="invest-amount-group g-2">
                    {["100", "200", "300", "400", "500"].map(
                      (
                        par,
                        index // Using dummy values for the invest levels
                      ) => (
                        <div
                          className="invest-amount-item"
                          key={index}
                          onClick={() => {
                            setRangVal(par);
                            setSliderVal(par);
                          }}
                        >
                          <input
                            type="radio"
                            className="invest-amount-control"
                            name="iv-amount"
                            checked={rangeVal === par}
                            value={rangeVal}
                            onChange={(e) => setRangVal(e.target.value)}
                            id={`iv-amount-${par}`}
                          />
                          <label className="invest-amount-label" htmlFor={`iv-amount-${par}`}>
                            {par} USD {/* Static currency and value for demonstration */}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="form-group invest-field">
                  <div className="form-label-group">
                    <label className="form-label">Or Enter Your Amount</label>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        tag="a"
                        onClick={(ev) => ev.preventDefault()}
                        href="#toggle"
                        className="link py-1"
                      >
                        Change Currency
                      </DropdownToggle>

                      <DropdownMenu end className="dropdown-menu-xxs">
                        <ul className="link-list-plain sm text-center">
                          <li>
                            <a
                              href="#toggle"
                              onClick={(ev) => {
                                ev.preventDefault();
                                setCurrency("usd");
                                setRangVal("100"); // Dummy value for USD
                                setSliderVal("100"); // Dummy value for USD
                              }}
                              className="dropdown-item"
                            >
                              USD
                            </a>
                          </li>
                          <li>
                            <a
                              href="#toggle"
                              onClick={(ev) => {
                                ev.preventDefault();
                                setCurrency("eur");
                                setRangVal("90"); // Dummy value for EUR
                                setSliderVal("90"); // Dummy value for EUR
                              }}
                              className="dropdown-item"
                            >
                              EUR
                            </a>
                          </li>
                          <li>
                            <a
                              href="#toggle"
                              onClick={(ev) => {
                                ev.preventDefault();
                                setCurrency("btc");
                                setRangVal("0.002"); // Dummy value for BTC
                                setSliderVal("0.002"); // Dummy value for BTC
                              }}
                              className="dropdown-item"
                            >
                              BTC
                            </a>
                          </li>
                          <li>
                            <a
                              href="#toggle"
                              onClick={(ev) => {
                                ev.preventDefault();
                                setCurrency("eth");
                                setRangVal("0.03"); // Dummy value for ETH
                                setSliderVal("0.03"); // Dummy value for ETH
                              }}
                              className="dropdown-item"
                            >
                              ETH
                            </a>
                          </li>
                        </ul>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                  <div className="form-control-group">
                    <div className="form-info">USD</div> {/* Static currency set to USD */}
                    <input
                      type="text"
                      className="form-control form-control-amount form-control-lg"
                      id="custom-amount"
                      value={rangeVal ?? getSelectedPlan?.min_deposit}
                      onChange={(e) => setRangVal(e.target.value)}
                    />
                    <Nouislider
                      className="form-range-slider"
                      range={{
                        min: getSelectedPlan?.min_deposit, // Static minimum value
                        max: getSelectedPlan?.max_deposit, // Static maximum value
                      }}
                      start={rangeVal}
                      onSlide={(values) => {
                        setRangVal(Math.round(values[0])); // Update state with the slider value
                      }}
                      behaviour="tap"
                      connect={[true, false]}
                    />
                  </div>

                  <div className="form-note pt-2">
                    {/* Static values for min and max deposit */}
                    {`Note: Minimum invest ${getSelectedPlan?.min_deposit} USD and upto ${getSelectedPlan?.max_deposit} USD`}
                  </div>
                </div>
                <div className="form-group invest-field">
                  <div className="form-label-group">
                    <label className="form-label">Choose Payment Method</label>
                  </div>
                  <input type="hidden" defaultValue="wallet" name="iv-wallet" id="invest-choose-wallet" />
                  <UncontrolledDropdown className="invest-cc-dropdown">
                    <DropdownToggle
                      tag="a"
                      onClick={(ev) => ev.preventDefault()}
                      href="#toggle"
                      className="invest-cc-chosen dropdown-indicator"
                    >
                      <div className="coin-item">
                        <div className="coin-icon">
                          <Icon name="offer-fill"></Icon>
                        </div>
                        <div className="coin-info">
                          <span className="coin-name">USD Wallet</span>
                          <span className="coin-text">Current balance: {user_wallet?.balance}</span>
                        </div>
                      </div>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-auto dropdown-menu-mxh">
                      {/* <li
                        className={`invest-cc-item`}
                        onClick={() => setWallet({ label: "NioWallet", value: "2.014095 BTC ( $18,934.84 )" })}
                      >
                        <DropdownItem
                          tag="a"
                          href="#dropdown-item"
                          onClick={(ev) => ev.preventDefault()}
                          className="invest-cc-opt"
                        >
                          <div className="coin-item">
                            <div className="coin-icon">
                              <Icon name="offer-fill"></Icon>
                            </div>
                            <div className="coin-info">
                              <span className="coin-name">NioWallet</span>
                              <span className="coin-text">Current balance : 2.014095 BTC ( $18,934.84 )</span>
                            </div>
                          </div>
                        </DropdownItem>
                      </li> */}
                      {/* <li
                        className="invest-cc-item"
                        onClick={() => setWallet({ label: "BTC Wallet", value: " 2.014095 BTC" })}
                      >
                        <DropdownItem
                          tag="a"
                          href="#dropdown-item"
                          onClick={(ev) => ev.preventDefault()}
                          className="invest-cc-opt"
                        >
                          <div className="coin-item">
                            <div className="coin-icon">
                              <Icon name="offer-fill"></Icon>
                            </div>
                            <div className="coin-info">
                              <span className="coin-name">BTC Wallet</span>
                              <span className="coin-text">Current balance : 2.014095 BTC</span>
                            </div>
                          </div>
                        </DropdownItem>
                      </li> */}
                      <li
                        className="invest-cc-item"
                        style={{ cursor: "not-allowed" }}
                        onClick={() => setWallet({ label: "USD Wallet", value: " $18,934.84" })}
                      >
                        <DropdownItem
                          tag="a"
                          href="#dropdown-item"
                          onClick={(ev) => ev.preventDefault()}
                          className="invest-cc-opt"
                        >
                          <div className="coin-item">
                            <div className="coin-icon">
                              <Icon name="offer-fill"></Icon>
                            </div>
                            <div className="coin-info">
                              <span className="coin-name">USD Wallet</span>
                              <span className="coin-text">Current balance : $ {user_wallet?.balance}</span>
                            </div>
                          </div>
                        </DropdownItem>
                      </li>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <div className="form-group invest-field">
                  <div className="custom-control custom-control-xs custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="checkbox"
                      value={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                    />
                    <label className="custom-control-label" htmlFor="checkbox">
                      I agree the{" "}
                      <a href="#link" onClick={(ev) => ev.preventDefault()}>
                        terms and &amp; conditions.
                      </a>
                    </label>
                  </div>
                </div>
              </Col>
              <Col xl="4" lg="5" className="offset-xl-1">
                <Card className="card-bordered ms-lg-4 ms-xl-0">
                  <div className="nk-iv-wg4">
                    <div className="nk-iv-wg4-sub">
                      <h6 className="nk-iv-wg4-title title">Your Investment Details</h6>
                      <ul className="nk-iv-wg4-overview g-2">
                        <li>
                          <div className="sub-text">Name of scheme</div>
                          <div className="lead-text">{getSelectedPlan?.name} Plan</div> {/* Static plan name */}
                        </li>
                        <li>
                          <div className="sub-text">Term of the scheme</div>
                          <div className="lead-text">{getSelectedPlan?.duration_days} days</div> {/* Static term */}
                        </li>
                        <li>
                          <div className="sub-text">Total profit</div>
                          <div className="lead-text">{getSelectedPlan?.cumulative_profit} USD</div>{" "}
                          {/* Static daily profit */}
                        </li>
                        <li>
                          <div className="sub-text">Daily profit %</div>
                          <div className="lead-text">{getSelectedPlan?.daily_profit}%</div>{" "}
                          {/* Static daily profit percentage */}
                        </li>

                        <li>
                          <div className="sub-text">Term start at</div>
                          <div className="lead-text">
                            Today {`(${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()})`}
                          </div>{" "}
                          {/* Static date */}
                        </li>
                        <li>
                          <div className="sub-text">Term end at</div>
                          <div className="lead-text">{date}</div> {/* Static end date */}
                        </li>
                      </ul>
                    </div>
                    <div className="nk-iv-wg4-sub">
                      <ul className="nk-iv-wg4-list">
                        <li>
                          <div className="sub-text">Payment Method</div>
                          <div className="lead-text">USD Wallet</div> {/* Static payment method */}
                        </li>
                      </ul>
                    </div>
                    <div className="nk-iv-wg4-sub">
                      <ul className="nk-iv-wg4-list">
                        <li>
                          <div className="sub-text">Amount to invest</div>
                          <div className="lead-text">{rangeVal} USD</div> {/* Static amount */}
                        </li>
                      </ul>
                    </div>
                    <div className="nk-iv-wg4-sub">
                      <ul className="nk-iv-wg4-list">
                        <li>
                          <div className="lead-text">Total Charge</div>
                          <div className="caption-text text-primary">{rangeVal} USD</div> {/* Static total charge */}
                        </li>
                      </ul>
                    </div>
                    <div
                      className="nk-iv-wg4-sub text-center bg-lighter"
                      onClick={(e) => {
                        e.preventDefault();
                        handleInvestMent();
                      }}
                    >
                      <Button size="lg" color="primary" className="ttu" disabled={isNotValid()}>
                        {" "}
                        {loading ? "Please wait..." : <>Confirm &amp; proceed</>}
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </form>
        </Block>

        {/* <Modal isOpen={modal} toggle={() => toggleModal()} className="modal-dialog-centered" size="lg">
          <ModalBody className="modal-body-md text-center">
            <div className="nk-modal">
              <h4 className="nk-modal-title">Confirm Password</h4>
              <div className="nk-modal-text">
                <p>
                  To confirm your payment of{" "}
                  <strong>
                    {rangeVal} {currency.toUpperCase()}
                  </strong>{" "}
                  on this order #93033939 using your <strong>{wallet.label}</strong>. Please enter the otp sent to your
                  email.
                </p>
              </div>
              <div className="nk-modal-form">
                <div className="form-group">
                  <input type="password" className="form-control form-control-password-big text-center" />
                </div>
              </div>
              <div className="nk-modal-action">
                <Button color="primary" size="lg" className="btn-mw" onClick={handleInvestMent}>
                  {loading ? "Please wait..." : "Confirm Payment"}
                </Button>
                <div className="sub-text sub-text-alt mt-3 mb-4">
                  This transaction will appear on your wallet statement as Invest *.
                </div>
                <a
                  href="#close"
                  onClick={(ev) => {
                    ev.preventDefault();
                    toggleModal();
                  }}
                  className="link link-soft"
                >
                  Cancel and return
                </a>
              </div>
            </div>
          </ModalBody>
        </Modal> */}

        <Modal isOpen={confirmModal} toggle={() => toggleConfirmModal()} className="modal-dialog-centered" size="lg">
          <ModalBody className="modal-body-lg text-center">
            <div className="nk-modal">
              <Icon name="check" className="nk-modal-icon icon-circle icon-circle-xxl bg-success" />
              <h4 className="nk-modal-title">Successfully Payment</h4>
              <div className="nk-modal-text">
                <p className="sub-text">
                  You have successfully order the Investment Plan of with amount of{" "}
                  <strong>
                    {rangeVal} {currency.toUpperCase()}
                  </strong>{" "}
                  using your <strong>Wallet</strong>.
                </p>
              </div>
              <div className="nk-modal-action-lg">
                <ul className="btn-group flex-wrap justify-center g-4">
                  <li>
                    <Link to={`${process.env.PUBLIC_URL}/invest/invest`} className="btn btn-lg btn-mw btn-primary">
                      More Invest
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${process.env.PUBLIC_URL}/invest/scheme-details/${createdInvestMent?.id}`}
                      className="btn btn-lg btn-mw btn-dim btn-primary"
                    >
                      <Icon name="reports"></Icon>
                      <span>Investment</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="bg-lighter">
            <div className="text-center w-100">
              <p>
                Earn upto $5 for each friend your refer!{" "}
                <a href="#tag" onClick={(ev) => ev.preventDefault()}>
                  Invite friends
                </a>
              </p>
            </div>
          </ModalFooter>
        </Modal>
      </Content>
    </React.Fragment>
  );
};

export default InvestmentProcess;
