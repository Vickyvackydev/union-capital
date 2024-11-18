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
import { useQuery } from "react-query";
import { GetPaymentMethods, GetWalletsByUserId, WithdrawalApi } from "../../../../services/service";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../state/slices/authreducer";
import toast from "react-hot-toast";
import { TokenBTC, TokenETH, TokenSOL } from "@web3icons/react";

const WithdrawalProcess = ({ match }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [currentPlan, setCurrentPlan] = useState();
  const [currency, setCurrency] = useState("usd");
  const [rangeVal, setRangVal] = useState(100);
  const [sliderVal, setSliderVal] = useState();
  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState();
  const [warning, setWarning] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [paymentDoneModal, setPaymentDoneModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  // const [paymentMethod, setPaymentMethod] = useState({
  //   label: "BTC",
  //   amount: "",
  //   address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  // });
  const [paymentMethod, setPaymentMethod] = useState({});
  const isNotValid = () => {
    return amount === "" || !paymentMethod.currency || !isChecked;
  };

  const { data: paymentMethods } = useQuery("payment-method", GetPaymentMethods);

  const switchTokenIcons = () => {
    switch (paymentMethod?.currency) {
      case "BTC":
        return <TokenBTC size={24} variant="mono" className="my-custom-class" />;

        break;
      case "ETH":
        return <TokenETH size={24} variant="mono" className="my-custom-class" />;

        break;
      case "SOL":
        return <TokenSOL size={24} variant="mono" className="my-custom-class" />;
      default:
        break;
    }
  };
  const switchTokenIconsV2 = (currency) => {
    switch (currency) {
      case "BTC":
        return <TokenBTC size={24} variant="mono" className="my-custom-class" />;

        break;
      case "ETH":
        return <TokenETH size={24} variant="mono" className="my-custom-class" />;

        break;
      case "SOL":
        return <TokenSOL size={24} variant="mono" className="my-custom-class" />;
      default:
        break;
    }
  };

  // const warningPrompt = () => {
  //   if (walletData?.balance > amount) {
  //     setWarning("");
  //   } else {
  //     setWarning("Insufficient funds");
  //   }
  // };
  const handleWithdraw = async () => {
    setLoading(true);

    const payload = {
      Amount: Number(amount),
      payment_method: paymentMethod.currency,
    };
    try {
      const res = await WithdrawalApi(payload); // Pass formData
      if (res) {
        setModal(false);
        setPaymentDoneModal(true);
        toast.success(res?.message);
        setAmount("");
      }
    } catch (error) {
      console.error(error?.response?.data?.message); // Log detailed error
      toast.error(error?.response?.data?.message || error?.message); // Show error message
    } finally {
      setLoading(false);
    }
  };
  console.log(paymentMethods);
  const user = useSelector(selectUser);
  const user_id = user?.id;

  useEffect(() => {
    let foundEl = pricingTableDataV1.find((item) => item.id === "plan-iv-2");
    console.log(foundEl);
    if (foundEl) {
      setCurrentPlan(foundEl);
      setRangVal(Number(returnCurrency(currency, foundEl.minDeposit).value).toFixed(0));
      setSliderVal(returnCurrency(currency, foundEl.minDeposit).value);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentPlan) {
      if (currency !== "btc") {
        setRangVal(Number(returnCurrency(currency, currentPlan.minDeposit).value).toFixed(0));
      } else {
        setRangVal(Number(returnCurrency(currency, currentPlan.minDeposit).value).toFixed(6));
      }
      setSliderVal(returnCurrency(currency, currentPlan.minDeposit).value);
    }
  }, [currentPlan]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onValChange(rangeVal);
  }, [rangeVal]);

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  const togglePaymentDoneModal = () => {
    setPaymentDoneModal(!confirmModal);
  };

  const calculateProfitReturns = (interest, term, principle) => {
    let value = Number(principle);
    let dailyProfit = value * (interest / 100);
    let totalNetProfit = dailyProfit * term;
    let totalReturn = totalNetProfit + value;

    return {
      dailyProfit: currency === "btc" ? dailyProfit.toFixed(6) : dailyProfit.toFixed(2),
      totalNetProfit: currency === "btc" ? totalNetProfit.toFixed(6) : totalNetProfit.toFixed(2),
      totalReturn: currency === "btc" ? totalReturn.toFixed(6) : totalReturn.toFixed(2),
    };
  };

  const calculateConversionFee = (value, fee) => {
    let invest = Number(value);
    let conversionFee = invest * (fee / 100);

    let totalFee = conversionFee + invest;

    return totalFee;
  };

  const onValChange = (val) => {
    let el = document.getElementById(`iv-amount-${Number(val).toFixed(0)}`);
    if (el) {
      el.click();
    }
  };

  return (
    <React.Fragment>
      <Head title="Investment"></Head>
      {currentPlan && (
        <Content size="lg">
          <BlockHead>
            {
              //   <BlockHeadContent>
              //     <BlockHeadSub>
              //       <BackTo icon="arrow-left" link={`/invest/invest`}>
              //         Back to plan
              //       </BackTo>
              //     </BlockHeadSub>
              //   </BlockHeadContent>
            }
            <BlockHeadContent>
              <BlockTitle tag="h2" className="fw-normal">
                Withdraw Funds
              </BlockTitle>
            </BlockHeadContent>
          </BlockHead>

          <Block className="invest-block">
            <form className="invest-form">
              <Row className="g-gs">
                <Col lg="7">
                  <div className="form-group invest-field">
                    <input type="hidden" defaultValue="silver" name="iv-plan" id="invest-choose-plan"></input>
                    {/* <UncontrolledDropdown className="invest-cc-dropdown">
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
                            <span>{paymentMethod?.currency || "Select payment method"}</span>
                          </div>
                        </div>
                      </DropdownToggle>

                      <DropdownMenu className="dropdown-menu-auto dropdown-menu-mxh">
                        {paymentMethods?.map((item) => (
                          <li className={`invest-cc-item`} onClick={() => setPaymentMethod(item)}>
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
                                  <span className="coin-name">{item?.currency}</span>
                                </div>
                              </div>
                            </DropdownItem>
                          </li>
                        ))}
                      </DropdownMenu>
                    </UncontrolledDropdown> */}
                  </div>
                  {
                    // <div className="form-group invest-field">
                    //   <div className="form-label-group">
                    //     <label className="form-label">Choose Quick Amount to Deposit</label>
                    //   </div>
                    //   <div className="invest-amount-group g-2">
                    //     {
                    //       //     returnLevel(currency, currentPlan.investLevels).map((par, index) => (
                    //       //     <div
                    //       //       className="invest-amount-item"
                    //       //       key={index}
                    //       //       onClick={() => {
                    //       //         setRangVal(par);
                    //       //         setSliderVal(par);
                    //       //       }}
                    //       //     >
                    //       //       <input
                    //       //         type="radio"
                    //       //         className="invest-amount-control"
                    //       //         name="iv-amount"
                    //       //         checked={rangeVal === par}
                    //       //         onChange={() => null}
                    //       //         id={`iv-amount-${par}`}
                    //       //       />
                    //       //       <label className="invest-amount-label" htmlFor={`iv-amount-${par}`}>
                    //       //         {currency === "btc" ? Number(par).toFixed(6) : par} {currency.toUpperCase()}
                    //       //       </label>
                    //       //     </div>
                    //       //   ))
                    //     }
                    //   </div>
                    // </div>
                  }
                  <div className="form-group invest-field">
                    {
                      //   <div className="form-label-group">
                      //     <label className="form-label">Enter Your Amount</label>
                      //     <UncontrolledDropdown>
                      //       {
                      //         //   <DropdownToggle
                      //         //     tag="a"
                      //         //     onClick={(ev) => ev.preventDefault()}
                      //         //     href="#toggle"
                      //         //     className="link py-1"
                      //         //   >
                      //         //     Change Currency
                      //         //   </DropdownToggle>
                      //       }
                      //       <DropdownMenu end className="dropdown-menu-xxs">
                      //         <ul className="link-list-plain sm text-center">
                      //           <li>
                      //             <DropdownItem
                      //               tag="a"
                      //               href="#toggle"
                      //               onClick={(ev) => {
                      //                 ev.preventDefault();
                      //                 setCurrency("eur");
                      //                 setRangVal(`${returnCurrency("eur", currentPlan.minDeposit).value}`);
                      //                 setSliderVal(`${returnCurrency("eur", currentPlan.minDeposit).value}`);
                      //               }}
                      //             >
                      //               BTC
                      //             </DropdownItem>
                      //           </li>
                      //           <li>
                      //             <DropdownItem
                      //               tag="a"
                      //               href="#toggle"
                      //               onClick={(ev) => {
                      //                 ev.preventDefault();
                      //                 setCurrency("btc");
                      //                 setRangVal(`${returnCurrency("btc", currentPlan.minDeposit).value}`);
                      //                 setSliderVal(`${returnCurrency("btc", currentPlan.minDeposit).value}`);
                      //               }}
                      //             >
                      //               LTC
                      //             </DropdownItem>
                      //           </li>
                      //           <li>
                      //             <DropdownItem
                      //               tag="a"
                      //               href="#toggle"
                      //               onClick={(ev) => {
                      //                 ev.preventDefault();
                      //                 setCurrency("eth");
                      //                 setRangVal(`${returnCurrency("eth", currentPlan.minDeposit).value}`);
                      //                 setSliderVal(`${returnCurrency("eth", currentPlan.minDeposit).value}`);
                      //               }}
                      //             >
                      //               ETH
                      //             </DropdownItem>
                      //           </li>
                      //         </ul>
                      //       </DropdownMenu>
                      //     </UncontrolledDropdown>
                      //   </div>
                    }
                    {
                      //   <div className="form-control-group">
                      //     <input
                      //       type="text"
                      //       className="form-control form-control-amount form-control-lg"
                      //       id="custom-amount"
                      //       value={currency === "btc" ? Number(rangeVal).toFixed(6) : Number(rangeVal).toFixed(0)}
                      //       onChange={(e) => {
                      //         setRangVal(e.target.value);
                      //         setSliderVal(e.target.value);
                      //         onValChange(e.target.value);
                      //       }}
                      //     />
                      //     <Nouislider
                      //       className="form-range-slider"
                      //       range={{
                      //         min: 200,
                      //         max: 5000,
                      //       }}
                      //       start={Number(sliderVal)}
                      //       behaviour="tap"
                      //       connect={[true, false]}
                      //       onChange={(val) => {
                      //         onValChange(val[0]);
                      //       }}
                      //       onSlide={(val) => setRangVal(val[0])}
                      //     />
                      //   </div>
                    }
                    {
                      <div className="form-note">
                        {
                          //     `Note: Minimum invest ${returnCurrency(currency, currentPlan.minDeposit).value} ${
                          //   returnCurrency(currency, currentPlan.minDeposit, true).label
                          // } and upto ${returnCurrency(currency, currentPlan.maxDeposit).value} ${
                          //   returnCurrency(currency, currentPlan.maxDeposit, true).label
                          // }`
                        }
                      </div>
                    }
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-control-amount form-control-lg"
                        style={{ borderRadius: 0 }}
                        id="custom-amount"
                        placeholder="Enter Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      {/* <span>{warningPrompt()}</span> */}
                    </div>
                  </div>
                  <div className="form-group invest-field">
                    <div className="form-label-group">
                      {<label className="form-label">Pick a Withdrawal Method</label>}
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
                          <div className="coin-icon">{switchTokenIcons() || <Icon name="offer-fill"></Icon>}</div>
                          <div className="coin-info">
                            <span>{paymentMethod?.currency || "Select payment method"}</span>
                          </div>
                        </div>
                      </DropdownToggle>

                      <DropdownMenu className="dropdown-menu-auto dropdown-menu-mxh">
                        {paymentMethods?.map((item) => (
                          <li className={`invest-cc-item`} onClick={() => setPaymentMethod(item)}>
                            <DropdownItem
                              tag="a"
                              href="#dropdown-item"
                              onClick={(ev) => ev.preventDefault()}
                              className="invest-cc-opt"
                            >
                              <div className="coin-item">
                                <div className="coin-icon">
                                  {/* <Icon name="offer-fill"></Icon> */}
                                  {switchTokenIconsV2(item?.currency)}
                                </div>
                                <div className="coin-info">
                                  <span className="coin-name">{item?.currency}</span>
                                </div>
                              </div>
                            </DropdownItem>
                          </li>
                        ))}
                        {/* <li
                        className="invest-cc-item"
                        onClick={() =>
                          setPaymentMethod({
                            label: "BTC",
                          })
                        }
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
                              <span className="coin-name">BTC</span>
                            </div>
                          </div>
                        </DropdownItem>
                      </li> */}
                        {/* <li
                        className="invest-cc-item"
                        onClick={() =>
                          setPaymentMethod({
                            label: "ETH",
                          })
                        }
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
                              <span className="coin-name">ETH</span>
                            </div>
                          </div>
                        </DropdownItem>
                      </li> */}
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
                  <Card className="card-bordered ms-lg-4 ms-xl-0">
                    <div className="nk-iv-wg4">
                      {
                        //     <div className="nk-iv-wg4-sub">
                        //   <h6 className="nk-iv-wg4-title title">Your Investment Details</h6>
                        //   <ul className="nk-iv-wg4-overview g-2">
                        //     <li>
                        //       <div className="sub-text">Name of scheme</div>
                        //       <div className="lead-text">{currentPlan.title} Plan</div>
                        //     </li>
                        //     <li>
                        //       <div className="sub-text">Term of the scheme</div>
                        //       <div className="lead-text">{currentPlan.term} days</div>
                        //     </li>
                        //     <li>
                        //       <div className="sub-text">Daily profit</div>
                        //       <div className="lead-text">
                        //         {calculateProfitReturns(currentPlan.interest, currentPlan.term, rangeVal).dailyProfit}{" "}
                        //         {currency.toUpperCase()}
                        //       </div>
                        //     </li>
                        //     <li>
                        //       <div className="sub-text">Daily profit %</div>
                        //       <div className="lead-text">{currentPlan.interest} %</div>
                        //     </li>
                        //     <li>
                        //       <div className="sub-text">Total net profit</div>
                        //       <div className="lead-text">
                        //         {
                        //           calculateProfitReturns(currentPlan.interest, currentPlan.term, rangeVal)
                        //             .totalNetProfit
                        //         }{" "}
                        //         {currency.toUpperCase()}
                        //       </div>
                        //     </li>
                        //     <li>
                        //       <div className="sub-text">Total Return</div>
                        //       <div className="lead-text">
                        //         {calculateProfitReturns(currentPlan.interest, currentPlan.term, rangeVal).totalReturn}{" "}
                        //         {currency.toUpperCase()}
                        //       </div>
                        //     </li>
                        //     <li>
                        //       <div className="sub-text">Term start at</div>
                        //       <div className="lead-text">Today ({dateFormatterAlt(new Date(), true)})</div>
                        //     </li>
                        //     <li>
                        //       <div className="sub-text">Term end at</div>
                        //       <div className="lead-text">
                        //         {dateFormatterAlt(addDays(new Date(), currentPlan.term), true)}
                        //       </div>
                        //     </li>
                        //   </ul>
                        // </div>
                        // <div className="nk-iv-wg4-sub">
                        //   <ul className="nk-iv-wg4-list">
                        //     <li>
                        //       <div className="sub-text">Payment Method</div>
                        //       <div className="lead-text">{wallet.label}</div>
                        //     </li>
                        //   </ul>
                        // </div>
                        // <div className="nk-iv-wg4-sub">
                        //   <ul className="nk-iv-wg4-list">
                        //     <li>
                        //       <div className="sub-text">Amount to invest</div>
                        //       <div className="lead-text">
                        //         {" "}
                        //         {currency === "btc" ? Number(rangeVal).toFixed(6) : Number(rangeVal).toFixed(2)}{" "}
                        //         {currency.toUpperCase()}
                        //       </div>
                        //     </li>
                        //     <li>
                        //       <div className="sub-text">
                        //         Conversion Fee <span>(0.5%)</span>
                        //       </div>
                        //       <div className="lead-text">
                        //         {" "}
                        //         {currency === "btc"
                        //           ? (rangeVal * 0.005).toFixed(6)
                        //           : (rangeVal * 0.005).toFixed(2)}{" "}
                        //         {currency.toUpperCase()}
                        //       </div>
                        //     </li>
                        //   </ul>
                        // </div>
                        // <div className="nk-iv-wg4-sub">
                        //   <ul className="nk-iv-wg4-list">
                        //     <li>
                        //       <div className="lead-text">Total Charge</div>
                        //       <div className="caption-text text-primary">
                        //         {currency === "btc"
                        //           ? calculateConversionFee(rangeVal, 0.5).toFixed(6)
                        //           : calculateConversionFee(rangeVal, 0.5).toFixed(2)}{" "}
                        //         {currency.toUpperCase()}
                        //       </div>
                        //     </li>
                        //   </ul>
                        // </div>
                      }
                      <div className="nk-iv-wg4-sub text-center bg-lighter">
                        <Button
                          size="lg"
                          color="primary"
                          className="ttu"
                          onClick={() => toggleModal()}
                          disabled={isNotValid()}
                        >
                          {" "}
                          Confirm &amp; proceed
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
                {<Col xl="4" lg="5" className="offset-xl-1"></Col>}
              </Row>
            </form>
          </Block>

          <Modal isOpen={modal} toggle={() => toggleModal()} className="modal-dialog-centered" size="lg">
            <ModalBody className="modal-body-md text-center">
              <div className="nk-modal">
                <div className="nk-modal-form">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-amount form-control-lg"
                      style={{ borderRadius: 0 }}
                      id="custom-amount"
                      placeholder="Enter Wallet Address"
                      //   value={}
                      onChange={(e) => setWalletAddress(e.target.value)}
                    />
                  </div>
                </div>
                <div className="nk-modal-action">
                  <Button
                    color="primary"
                    size="lg"
                    className="btn-mw"
                    onClick={handleWithdraw}
                    disabled={!walletAddress}
                  >
                    {loading ? "Please wait..." : "Withdraw"}
                  </Button>
                  <a
                    style={{ marginLeft: 45 }}
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
          </Modal>

          <Modal
            isOpen={paymentDoneModal}
            toggle={() => togglePaymentDoneModal()}
            className="modal-dialog-centered"
            size="lg"
          >
            <ModalBody className="modal-body-md text-center">
              <div className="nk-modal">
                <div className="nk-modal-text">
                  <span className="coin-text" style={{ fontSize: 20, color: "green" }}>
                    Withdrawal Was Successful
                  </span>
                </div>
                <div className="nk-modal-action">
                  <Button
                    color="primary"
                    size="lg"
                    className="btn-mw"
                    onClick={() => {
                      togglePaymentDoneModal();
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </Content>
      )}
    </React.Fragment>
  );
};

export default WithdrawalProcess;
