import React, { useState, useEffect } from "react";
import Content from "../../../../layout/content/Content";
import Head from "../../../../layout/head/Head";
import {
  BackTo,
  BlockHeadContent,
  BlockHeadSub,
  BlockTitle,
  BlockHead,
  Block,
  Icon,
  BlockDes,
  BlockBetween,
  PreviewAltCard,
  TooltipComponent,
  Knob,
} from "../../../../components/Component";
import { Badge, Button, Col, Row, Card } from "reactstrap";
import { pricingTableDataV1, activePlans } from "../data";
import { dayRemainKnob, netProfitKnob, overviewKnob, transactionData } from "../data";
import { useQuery } from "react-query";
import { GetSingleInvestment, GetSingleTransaction } from "../../../../services/service";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import moment from "moment";
import { DynamicDate } from "../../../../utils/Utils";

const InvestmentDetails = ({ match }) => {
  const [currentPlan, setCurrentPlan] = useState();
  // const { id } = useParams();
  const id = window.location.pathname.split("/").pop();
  const { data: investment_details } = useQuery(["investment_id", id], () => GetSingleInvestment(id));
  const { data: transaction_details } = useQuery(["transaction_id", id], () => GetSingleTransaction(id));

  console.log(transaction_details);

  useEffect(() => {
    let foundEl = pricingTableDataV1.find((item) => item.id === match.params.id);
    if (foundEl) {
      setCurrentPlan(foundEl);
    } else {
      let foundEl = activePlans.find((item) => item.id === match.params.id);
      if (foundEl) {
        setCurrentPlan(foundEl);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const returnSum = (a1, a2) => {
    let sum = Number(a1) + a2;
    return sum.toFixed(2);
  };

  const totalReturn = () => {
    let total = returnSum(
      Number(
        investment_details?.plan?.min_deposit *
          (investment_details?.plan?.daily_profit / 100) *
          investment_details?.plan?.duration_days
      ).toFixed(2),
      investment_details?.plan?.min_deposit
    );

    return total;
  };

  return (
    <React.Fragment>
      <Head title="Scheme / Plan Detail"></Head>
      <Content size="lg">
        <React.Fragment>
          <BlockHead>
            <BlockHeadContent>
              <BlockHeadSub>
                <BackTo icon="arrow-left" link={`/invest/schemes`}>
                  My Investment
                </BackTo>
              </BlockHeadSub>
            </BlockHeadContent>
            <BlockBetween size="md" className="g-4">
              <BlockHeadContent>
                <BlockTitle tag="h2" className="fw-normal">
                  {investment_details?.plan?.name} - Daily {investment_details?.plan?.daily_profit}% for{" "}
                  {investment_details?.plan?.duration_days} Days
                </BlockTitle>
                <BlockDes>
                  <p>
                    INV-498238 <Badge color="primary">Running</Badge>
                  </p>
                </BlockDes>
              </BlockHeadContent>
              <BlockHeadContent>
                <ul className="nk-block-tools gx-3">
                  <li className="order-md-last">
                    <Button color="danger">
                      <Icon name="cross"></Icon> <span>Cancel this plan</span>{" "}
                    </Button>
                  </li>
                  <li>
                    <Button color="light" className="btn-icon">
                      <Icon name="reload"></Icon>
                    </Button>
                  </li>
                </ul>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>

          <Block>
            <Card className="card-bordered">
              <div className="card-inner">
                <Row className="gy-gs">
                  <Col md="6">
                    <div className="nk-iv-wg3">
                      <div className="nk-iv-wg3-group flex-lg-nowrap gx-4">
                        <div className="nk-iv-wg3-sub">
                          <div className="nk-iv-wg3-amount">
                            <div className="number">{investment_details?.amount?.toFixed(2)}</div>
                          </div>
                          <div className="nk-iv-wg3-subtitle">Invested Amount</div>
                        </div>
                        <div className="nk-iv-wg3-sub">
                          <span className="nk-iv-wg3-plus text-soft">
                            <Icon name="plus"></Icon>
                          </span>
                          <div className="nk-iv-wg3-amount">
                            <div className="number">
                              {investment_details?.profit_earned ?? 100.0}
                              <span className="number-up">{investment_details?.plan?.daily_profit} %</span>
                            </div>
                          </div>
                          <div className="nk-iv-wg3-subtitle">Profit Earned</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md="6" lg="4" className="offset-lg-2">
                    <div className="nk-iv-wg3 ps-md-3">
                      <div className="nk-iv-wg3-group flex-lg-nowrap gx-4">
                        <div className="nk-iv-wg3-sub">
                          <div className="nk-iv-wg3-amount">
                            <div className="number">
                              {totalReturn()}{" "}
                              <span className="number-down">
                                1017.14{" "}
                                <TooltipComponent
                                  icon="info-fill"
                                  direction="right"
                                  text="Total Return "
                                  id="total-return-invest"
                                />
                              </span>
                            </div>
                          </div>
                          <div className="nk-iv-wg3-subtitle">Total Return</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="nk-iv-scheme-details">
                <ul className="nk-iv-wg3-list">
                  <li>
                    <div className="sub-text">Term</div>
                    <div className="lead-text">{investment_details?.plan?.duration_days} Days</div>
                  </li>
                  <li>
                    <div className="sub-text">Term start at</div>
                    <div className="lead-text">
                      {moment(investment_details?.created_at).format("MMM D, YYYY h:mma")}
                    </div>
                  </li>
                  <li>
                    <div className="sub-text">Term end at</div>
                    <div className="lead-text">
                      {moment(investment_details?.end_date).format("MMM D, YYYY h:mma")}
                      {/* <DynamicDate daysToAdd={Number(investment_details?.plan?.duration_days)} />{" "} */}
                    </div>
                  </li>
                  <li>
                    <div className="sub-text">Daily interest</div>
                    <div className="lead-text">{investment_details?.plan?.daily_profit}%</div>
                  </li>
                </ul>
                <ul className="nk-iv-wg3-list">
                  <li>
                    <div className="sub-text">Ordered date</div>
                    <div className="lead-text"> {moment(investment_details?.created_at).format("h:mma")}</div>
                  </li>
                  <li>
                    <div className="sub-text">Approved date</div>
                    <div className="lead-text"> {moment(investment_details?.created_at).format("h:mma")}</div>
                  </li>
                  <li>
                    <div className="sub-text">Payment method</div>
                    <div className="lead-text">Wallet Balance</div>
                  </li>
                  <li>
                    <div className="sub-text">
                      Paid <small>(fee include)</small>
                    </div>
                    <div className="lead-text">
                      <span className="currency currency-usd">0 USD</span>{" "}
                      {/* {Number(currentPlan.minDeposit.usd + currentPlan.minDeposit.usd * 0.05).toFixed(2)} */}
                    </div>
                  </li>
                </ul>
                <ul className="nk-iv-wg3-list">
                  <li>
                    <div className="sub-text">Captial invested</div>
                    <div className="lead-text">
                      <span className="currency currency-usd">USD</span> {investment_details?.amount}
                    </div>
                  </li>
                  <li>
                    <div className="sub-text">Daily profit</div>
                    <div className="lead-text">
                      <span className="currency currency-usd">USD</span> {investment_details?.plan?.daily_profit}
                    </div>
                  </li>
                  <li>
                    <div className="sub-text">Net profit</div>
                    <div className="lead-text">
                      <span className="currency currency-usd">USD</span>{" "}
                      {investment_details?.expected_net_return.toFixed(2)}
                    </div>
                  </li>
                  <li>
                    <div className="sub-text">Total return</div>
                    <div className="lead-text">
                      <span className="currency currency-usd">USD</span>{" "}
                      {investment_details?.expected_total_return.toFixed(2)}
                    </div>
                  </li>
                </ul>
              </div>
            </Card>
          </Block>

          <Block size="lg">
            <BlockHead>
              <BlockTitle tag="h5">Graph view</BlockTitle>
            </BlockHead>

            <Row className="g-gs">
              <Col lg="5">
                <PreviewAltCard className="card-bordered h-100" bodyClass="justify-center text-center h-100">
                  <div className="nk-iv-wg5">
                    <div className="nk-iv-wg5-head">
                      <h5 className="nk-iv-wg5-title">Overview</h5>
                    </div>
                    <div className="nk-iv-wg5-ck">
                      <Knob data={overviewKnob} type="half" />
                      <div className="nk-iv-wg5-ck-result">
                        <div className="text-lead">68.9%</div>
                        <div className="text-sub">112.54 / per day</div>
                      </div>
                      <div className="nk-iv-wg5-ck-minmax">
                        {/* <span>{currentPlan.minDeposit.usd.toFixed(2)}</span> */}
                        {/* <span>{totalReturn()}</span> */}
                      </div>
                    </div>
                  </div>
                </PreviewAltCard>
              </Col>
              <Col className="col-lg" sm="6">
                <PreviewAltCard className="card-bordered h-100" bodyClass="justify-center text-center h-100">
                  <div className="nk-iv-wg5">
                    <div className="nk-iv-wg5-head">
                      <h5 className="nk-iv-wg5-title">Net Profit</h5>
                      <div className="nk-iv-wg5-subtitle">
                        Earn so far{" "}
                        <strong>
                          {/* {Number(currentPlan.minDeposit.usd * (currentPlan.interest / 100) * currentPlan.term).toFixed(
                            2
                          )} */}
                        </strong>{" "}
                        <span className="currency currency-usd">USD</span>
                      </div>
                    </div>
                    <div className="nk-iv-wg5-ck sm">
                      <Knob data={netProfitKnob} type="half" />
                      <div className="nk-iv-wg5-ck-result">
                        {/* <div className="text-lead sm">{currentPlan.interest}%</div> */}
                        <div className="text-sub">Daily profit</div>
                      </div>
                      <div className="nk-iv-wg5-ck-minmax">
                        <span>0.00</span>
                        {/* <span>
                          {Number(currentPlan.minDeposit.usd * (currentPlan.interest / 100) * currentPlan.term).toFixed(
                            2
                          )}
                        </span> */}
                      </div>
                    </div>
                  </div>
                </PreviewAltCard>
              </Col>
              <Col className="col-lg" sm="6">
                <PreviewAltCard className="card-bordered h-100" bodyClass="justify-center text-center h-100">
                  <div className="nk-iv-wg5">
                    <div className="nk-iv-wg5-head">
                      <h5 className="nk-iv-wg5-title">Day Remain</h5>
                      <div className="nk-iv-wg5-subtitle">
                        Earn so far <strong>1,643.76</strong> <span className="currency currency-usd">USD</span>
                      </div>
                    </div>
                    <div className="nk-iv-wg5-ck sm">
                      <Knob data={dayRemainKnob} type="half" />
                      <div className="nk-iv-wg5-ck-result">
                        {/* <div className="text-lead sm">{currentPlan.term - 2} D</div> */}
                        <div className="text-sub">day remain</div>
                      </div>
                      <div className="nk-iv-wg5-ck-minmax">
                        <span>0</span>
                        {/* <span>{currentPlan.term}</span> */}
                      </div>
                    </div>
                  </div>
                </PreviewAltCard>
              </Col>
            </Row>
          </Block>
          <Block size="lg">
            <BlockHead>
              <BlockTitle tag="h5">Transactions</BlockTitle>
            </BlockHead>
            <Card className="card-bordered">
              <table className="table table-iv-tnx">
                <thead className="table-light">
                  <tr>
                    <th className="tb-col-type">
                      <span className="overline-title">Type</span>
                    </th>
                    <th className="tb-col-date">
                      <span className="overline-title">Date</span>
                    </th>
                    <th className="tb-col-amount tb-col-end">
                      <span className="overline-title">Amount</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactionData.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td className="tb-col-type">
                          <span className="sub-text">{item.type}</span>
                        </td>
                        <td className="tb-col-date">
                          <span className="sub-text">{item.date}</span>
                        </td>
                        <td className="tb-col-amount tb-col-end">
                          <span className={`lead-text ${item.amount.split("")[0] === "-" ? "text-danger" : ""}`}>
                            {item.amount}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </Block>
        </React.Fragment>
      </Content>
    </React.Fragment>
  );
};

export default InvestmentDetails;
