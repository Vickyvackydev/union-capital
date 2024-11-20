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
import { useMutation, useQuery } from "react-query";
import { GetPaymentMethods, GetWalletsByUserId, SubmitPaymentApi } from "../../../../services/service";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";
import { selectUser } from "../../../../state/slices/authreducer";
import { useSelector } from "react-redux";
import { TokenBTC, TokenETH, TokenIcon, TokenSOL } from "@web3icons/react";

const TransferProcess = ({ history }) => {
  const [loading, setLoading] = useState();
  const [currentPlan, setCurrentPlan] = useState();
  const [currency, setCurrency] = useState("usd");
  const [rangeVal, setRangVal] = useState(100);
  const [sliderVal, setSliderVal] = useState();
  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [paymentDoneModal, setPaymentDoneModal] = useState(false);

  const [formData, setFormData] = useState({
    amount: 0,
    email: "",
    transaction_id: "",
  });

  const [paymentMethod, setPaymentMethod] = useState({});
  const isNotValid = () => {
    return formData.amount === "" || !paymentMethod.currency || !isChecked;
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const amountField = ["amount"].includes(name);
    if (amountField && !/^[0-9]*\.?[0-9]*$/.test(value)) return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const user = useSelector(selectUser);
  const user_id = user?.id;

  const { data: walletData } = useQuery(["wallet", user_id], () => GetWalletsByUserId(user_id));
  const handlePayment = async () => {
    setLoading(true);

    const payload = {
      Amount: Number(formData.amount),
      payment_method: paymentMethod.currency,
      tx_id: formData.transaction_id,
    };
    try {
      const res = await SubmitPaymentApi(payload); // Pass formData
      if (res) {
        setModal(false);
        setPaymentDoneModal(true);
        toast.success("Payment has being confirmed");
        setFormData({
          amount: 0,
          transaction_id: "",
        });
      }
    } catch (error) {
      console.error(error?.response?.data?.message); // Log detailed error
      toast.error(error?.response?.data?.message || error?.message); // Show error message
    } finally {
      setLoading(false);
    }
  };

  const { data: paymentMethods } = useQuery("payment-method", GetPaymentMethods);

  console.log(paymentMethods);

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
    history.push("/");
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

      <Content size="lg">
        <BlockHead>
          <BlockHeadContent>
            <BlockTitle tag="h2" className="fw-normal">
              Transfer Funds
            </BlockTitle>
          </BlockHeadContent>
        </BlockHead>

        <Block className="invest-block">
          <form className="invest-form">
            <Row className="g-gs">
              <Col lg="7">
                <div className="form-group invest-field">
                  <div className="form-group">
                    <input
                      type="text"
                      name="amount"
                      className="form-control form-control-amount form-control-lg"
                      style={{ borderRadius: 0 }}
                      id="custom-amount"
                      placeholder="Enter Amount"
                      value={formData.amount}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="email"
                      className="form-control form-control-amount form-control-lg"
                      style={{ borderRadius: 0 }}
                      id="custom-amount"
                      placeholder="Enter user address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group invest-field">
                  <div className="form-label-group">{<label className="form-label">Pick a Payment Method</label>}</div>
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
                          {switchTokenIcons() || <Icon name="offer-fill"></Icon>}
                          {/* <TokenIcon symbol={`eth`} variant="mono" /> */}
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
                              <div className="coin-icon">{switchTokenIconsV2(item?.currency)}</div>
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
                    <div className={`nk-iv-wg4-sub text-center bg-lighter`}>
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
              <div className="nk-modal-text">
                <span className="coin-text">Address : {paymentMethod?.wallet_address}</span>

                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "25%", marginTop: "4px" }}
                  value={paymentMethod?.wallet_address}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <div className="nk-modal-form">
                <div className="form-group">
                  <span className="coin-text" style={{ display: "flex", alignItems: "start", justifyContent: "start" }}>
                    Please enter the transaction hash ID to comfirm your payment.
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-amount form-control-lg"
                    style={{ borderRadius: 0 }}
                    id="custom-amount"
                    name="transaction_id"
                    placeholder="Enter Hash ID"
                    value={formData.transaction_id}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="nk-modal-action">
                <Button
                  color="primary"
                  size="lg"
                  className="btn-mw"
                  // onClick={() => {
                  //   toggleModal();
                  //   toggleConfirmModal();
                  //   togglePaymentDoneModal();
                  // }}
                  disabled={!formData.transaction_id}
                  onClick={handlePayment}
                >
                  {loading ? "Please wait..." : "Confirm Payment"}
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
                <span className="item-label">
                  Your deposit will reflect on your wallet balance once the transaction is confirmed on Blockchain
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
    </React.Fragment>
  );
};

export default TransferProcess;