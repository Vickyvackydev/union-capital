import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Link } from "react-router-dom";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockHeadSub,
  BlockTitle,
  Icon,
  TooltipComponent,
} from "../../../components/Component";
import { Button, Card, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
import { ProfitCharts } from "../../../components/partials/charts/panel/PanelCharts";
import { BASE_URL } from "../../../App";
import { useQuery } from "react-query";
import { GetInvestmentApi, GetUserWallet, overviewAnalyticsApi } from "../../../services/service";
import moment from "moment";
import { DynamicDate } from "../../../utils/Utils";

const Plan = () => {
  const [date, setDate] = useState("");
  const { data: overview_data } = useQuery("overview", overviewAnalyticsApi);
  const { data: investmentData } = useQuery("investment", GetInvestmentApi);

  const { data: user_wallet } = useQuery("wallet", GetUserWallet);

  console.log(investmentData);

  return (
    <React.Fragment>
      <Head title="Investments"></Head>
      <Content size="lg">
        <BlockHead>
          <BlockHeadContent>
            <BlockHeadSub>My Investments</BlockHeadSub>
            <BlockBetween size="md" className="g-4">
              <BlockHeadContent>
                <BlockTitle tag="h2" className="fw-normal">
                  Investments
                </BlockTitle>
                <BlockDes>
                  <p>Here is your current balance and your active investements.</p>
                </BlockDes>
              </BlockHeadContent>
              <BlockHeadContent>
                <ul className="nk-block-tools gx-3">
                  <li>
                    <Link to={`${process.env.PUBLIC_URL}/invest/withdrawal`} className="btn-block">
                      <Button color="primary">
                        <span style={{ color: "white" }}>Withdraw</span>{" "}
                        <Icon
                          style={{ color: "white" }}
                          name="arrow-long-right"
                          className="d-none d-sm-inline-block"
                        ></Icon>
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link to={`${process.env.PUBLIC_URL}/invest/invest`} className="btn-block">
                      <Button color="white" className="btn-light">
                        {" "}
                        <span style={{ color: "black" }}> Invest More</span>
                        <Icon name="arrow-long-right" className="d-none d-sm-inline-block"></Icon>
                      </Button>
                    </Link>
                  </li>
                  <li className="opt-menu-md">
                    <UncontrolledDropdown>
                      <DropdownMenu end>
                        <ul className="link-list-opt no-bdr">
                          <li>
                            <DropdownItem tag="a" href="#item" onClick={(ev) => ev.preventDefault()}>
                              <Icon name="coin-alt"></Icon>
                              <span>Curreny Settings</span>
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem tag="a" href="#item" onClick={(ev) => ev.preventDefault()}>
                              <Icon name="notify"></Icon>
                              <span>Push Notification</span>
                            </DropdownItem>
                          </li>
                        </ul>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </li>
                </ul>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHeadContent>
        </BlockHead>

        <Block size="lg">
          <Card className="card-bordered">
            <div className="card-inner-group">
              <div className="card-inner">
                <Row className="gy-gs">
                  <Col lg="5">
                    <div className="nk-iv-wg3">
                      <div className="nk-iv-wg3-title">Total Balance</div>
                      <div className="nk-iv-wg3-group  flex-lg-nowrap gx-4">
                        <div className="nk-iv-wg3-sub">
                          <div className="nk-iv-wg3-amount">
                            <div className="number">
                              {user_wallet?.balance}.00 <small className="currency currency-usd">USD</small>
                            </div>
                          </div>
                          <div className="nk-iv-wg3-subtitle">Available Balance</div>
                        </div>
                        <div className="nk-iv-wg3-sub">
                          <span className="nk-iv-wg3-plus text-soft">
                            <Icon name="plus"></Icon>
                          </span>
                          <div className="nk-iv-wg3-amount">
                            <div className="number-sm">{overview_data?.total_invested.toFixed(2)}</div>
                          </div>
                          <div className="nk-iv-wg3-subtitle">
                            Locked Balance{" "}
                            <TooltipComponent
                              icon="info-fill"
                              direction="right"
                              text="You can't user"
                              id="ref-lock-balance"
                            ></TooltipComponent>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg="7">
                    <div className="nk-iv-wg3">
                      <div className="nk-iv-wg3-title" style={{ marginTop: 35 }}></div>
                      <div className="nk-iv-wg3-group flex-md-nowrap g-4">
                        <div className="nk-iv-wg3-sub-group gx-4">
                          <div className="nk-iv-wg3-sub">
                            <div className="nk-iv-wg3-amount">
                              <div className="number">{overview_data?.total_profit.toFixed(2)}</div>
                            </div>
                            <div className="nk-iv-wg3-subtitle">Total Profit</div>
                          </div>
                          <div className="nk-iv-wg3-sub">
                            <span className="nk-iv-wg3-plus text-soft">
                              <Icon name="plus"></Icon>
                            </span>
                            <div className="nk-iv-wg3-amount">
                              <div className="number-sm">{overview_data?.todays_profit.toFixed(2)}</div>
                            </div>
                            <div className="nk-iv-wg3-subtitle">Today Profit</div>
                          </div>
                        </div>
                        <div className="nk-iv-wg3-sub flex-grow-1 ms-md-3">
                          <div className="nk-iv-wg3-ck">
                            <ProfitCharts />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="card-inner">
                <ul className="nk-iv-wg3-nav">
                  <li>
                    <Link to={`${process.env.PUBLIC_URL}/invest/transactions`}>
                      <Icon name="notes-alt"></Icon> <span>Go to Transaction</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </Block>

        <Block size="lg">
          <BlockHead size="sm">
            <BlockTitle tag="h5">
              Active Investments<span className="count text-base">{`(${investmentData?.records?.length})`}</span>
            </BlockTitle>
          </BlockHead>
          <div className="nk-iv-scheme-list">
            {investmentData?.records?.map((item) => (
              <div className="nk-iv-scheme-item">
                <div className="nk-iv-scheme-icon is-running">
                  <Icon name="update"></Icon>
                </div>
                <div className="nk-iv-scheme-info">
                  <div className="nk-iv-scheme-name">
                    {item?.plan?.name} - Daily {item?.plan?.daily_profit}% for {item?.plan?.duration_days} Days
                  </div>
                  <div className="nk-iv-scheme-desc">
                    Invested Amount - <span className="amount">${item?.amount?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="nk-iv-scheme-term">
                  <div className="nk-iv-scheme-start nk-iv-scheme-order">
                    <span className="nk-iv-scheme-label text-soft">Start Date</span>
                    <span className="nk-iv-scheme-value date">{moment(item?.created_at).format("MMM D, YYYY")}</span>
                  </div>
                  <div className="nk-iv-scheme-end nk-iv-scheme-order">
                    <span className="nk-iv-scheme-label text-soft">End Date</span>
                    <span className="nk-iv-scheme-value date">
                      {/* <DynamicDate daysToAdd={item?.plan?.duration_days} /> */}
                      {moment(item?.end_date).format("MMM D, YYYY")}
                    </span>
                  </div>
                </div>
                <div className="nk-iv-scheme-amount">
                  <div className="nk-iv-scheme-amount-a nk-iv-scheme-order">
                    <span className="nk-iv-scheme-label text-soft">Total Return</span>
                    <span className="nk-iv-scheme-value amount">${item?.expected_net_return.toFixed(2)}</span>
                  </div>
                  <div className="nk-iv-scheme-amount-b nk-iv-scheme-order">
                    <span className="nk-iv-scheme-label text-soft">Net Profit Earn</span>
                    <span className="nk-iv-scheme-value amount">
                      <span className="amount-ex">~ ${item?.expected_total_return.toFixed(2)}</span>
                    </span>
                  </div>
                </div>
                <div className="nk-iv-scheme-more">
                  <Link
                    className="btn btn-icon btn-lg btn-round btn-trans"
                    to={`${process.env.PUBLIC_URL}/invest/scheme-details/${item?.id}`}
                  >
                    <Icon name="forward-ios"></Icon>
                  </Link>
                </div>
                <div className="nk-iv-scheme-progress">
                  <div className="progress-bar" style={{ width: "90%" }}></div>
                </div>
              </div>
            ))}
          </div>
        </Block>

        {/* <Block>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle tag="h5">
                  Recent Ended <span className="count text-base">(1)</span>
                </BlockTitle>
              </BlockHeadContent>
              <BlockHeadContent>
                <a href="#link" onClick={(ev) => ev.preventDefault()}>
                  <Icon name="dot-box"></Icon> Go to Archive
                </a>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
          <div className="nk-iv-scheme-list">
            <div className="nk-iv-scheme-item">
              <div className="nk-iv-scheme-icon is-done">
                <Icon name="offer"></Icon>
              </div>
              <div className="nk-iv-scheme-info">
                <div className="nk-iv-scheme-name">Silver - Daily 4.76% for 21 Days</div>
                <div className="nk-iv-scheme-desc">
                  Invested Amount - <span className="amount">$250</span>
                </div>
              </div>
              <div className="nk-iv-scheme-term">
                <div className="nk-iv-scheme-start nk-iv-scheme-order">
                  <span className="nk-iv-scheme-label text-soft">Start Date</span>
                  <span className="nk-iv-scheme-value date">Nov 04, 2019</span>
                </div>
                <div className="nk-iv-scheme-end nk-iv-scheme-order">
                  <span className="nk-iv-scheme-label text-soft">End Date</span>
                  <span className="nk-iv-scheme-value date">Nov 25, 2019</span>
                </div>
              </div>
              <div className="nk-iv-scheme-amount">
                <div className="nk-iv-scheme-amount-a nk-iv-scheme-order">
                  <span className="nk-iv-scheme-label text-soft">Total Return</span>
                  <span className="nk-iv-scheme-value amount">$ 499.99</span>
                </div>
                <div className="nk-iv-scheme-amount-b nk-iv-scheme-order">
                  <span className="nk-iv-scheme-label text-soft">Net Profit Earn</span>
                  <span className="nk-iv-scheme-value amount">
                    $ 97.95 <span className="amount-ex">~ $152.04</span>
                  </span>
                </div>
              </div>
              <div className="nk-iv-scheme-more">
                <Link
                  className="btn btn-icon btn-lg btn-round btn-trans"
                  to={`${process.env.PUBLIC_URL}/invest/scheme-details/plan-v-1`}
                >
                  <Icon name="forward-ios"></Icon>
                </Link>
              </div>
            </div>
            <div className="nk-iv-scheme-item">
              <div className="nk-iv-scheme-icon is-done">
                <Icon name="offer"></Icon>
              </div>
              <div className="nk-iv-scheme-info">
                <div className="nk-iv-scheme-name">Silver - Daily 4.76% for 21 Days</div>
                <div className="nk-iv-scheme-desc">
                  Invested Amount - <span className="amount">$1,250</span>
                </div>
              </div>
              <div className="nk-iv-scheme-term">
                <div className="nk-iv-scheme-start nk-iv-scheme-order">
                  <span className="nk-iv-scheme-label text-soft">Start Date</span>
                  <span className="nk-iv-scheme-value date">Oct 30, 2019</span>
                </div>
                <div className="nk-iv-scheme-end nk-iv-scheme-order">
                  <span className="nk-iv-scheme-label text-soft">End Date</span>
                  <span className="nk-iv-scheme-value date">Nov 19, 2019</span>
                </div>
              </div>
              <div className="nk-iv-scheme-amount">
                <div className="nk-iv-scheme-amount-a nk-iv-scheme-order">
                  <span className="nk-iv-scheme-label text-soft">Total Return</span>
                  <span className="nk-iv-scheme-value amount">$ 2,500</span>
                </div>
                <div className="nk-iv-scheme-amount-b nk-iv-scheme-order">
                  <span className="nk-iv-scheme-label text-soft">Net Profit Earn</span>
                  <span className="nk-iv-scheme-value amount">
                    $ 1145.25 <span className="amount-ex">~ $105.75</span>
                  </span>
                </div>
              </div>
              <div className="nk-iv-scheme-more">
                <Link
                  className="btn btn-icon btn-lg btn-round btn-trans"
                  to={`${process.env.PUBLIC_URL}/invest/scheme-details/plan-v-2`}
                >
                  <Icon name="forward-ios"></Icon>
                </Link>
              </div>
            </div>
          </div>
        </Block> */}
      </Content>
    </React.Fragment>
  );
};

export default Plan;
