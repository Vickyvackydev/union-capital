import React, { useEffect, useState } from "react";
// import Icon from "../../../icon/Icon";
// import UserAvatar from "../../../user/UserAvatar";
import "./transaction.css";
import { PreviewAltCard } from "../../../Component";
import { transactionData } from "./TransactionData";
import {
  CardTitle,
  // UncontrolledDropdown,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
  Badge,
  Col,
  Row,
} from "reactstrap";
import { DataTableBody, DataTableHead, DataTableItem, DataTableRow } from "../../../table/DataTable";
import { Link } from "react-router-dom";
import Head from "../../../../layout/head/Head";
import { useQuery } from "react-query";
import { GetTransactions } from "../../../../services/service";
import moment from "moment";

const TransactionTable = () => {
  const { data: transaction_data } = useQuery("transactions", GetTransactions);
  const [data, setData] = useState(transaction_data);
  const [trans, setTrans] = useState("");

  const pendingTransaction = transaction_data?.records?.filter((item) => item.status === "pending");
  const approvedTransaction = transaction_data?.records?.filter((item) => item.status === "approved");
  const allTransaction = transaction_data?.records;
  const switchTransactions = () => {
    switch (trans) {
      case "pending":
        return pendingTransaction;

        break;
      case "approved":
        return approvedTransaction;

      case "all":
        return allTransaction;
      default:
        return allTransaction;
        break;
    }
  };
  // useEffect(() => {
  //   let filteredData;
  //   if (trans === "pending") {

  //   } else if (trans === "approved") {
  //     filteredData = transaction_data?.records?.filter((item) => item.status === "approved");
  //   } else if (trans === "all") {
  //     filteredData = transaction_data?.records;
  //   } else {
  //     filteredData === transaction_data?.records;
  //   }
  //   setData(filteredData);
  // }, [trans]);

  console.log(transaction_data);

  return (
    <React.Fragment>
      <div className="card-inner">
        <Head title="Transactions"></Head>
        <div className="card-title-group" style={{ marginTop: "75px" }}>
          <CardTitle>
            <h6 className="title">
              <span className="me-2">Transaction</span>{" "}
              <Link to={`${process.env.PUBLIC_URL}/transaction-basic`} className="link d-none d-sm-inline">
                See History
              </Link>
            </h6>
          </CardTitle>
          <div className="card-tools">
            <ul className="card-tools-nav">
              <li className={trans === "approved" ? "active" : ""} onClick={() => setTrans("approved")}>
                <a
                  href="#paid"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  <span>Paid</span>
                </a>
              </li>
              <li className={trans === "pending" ? "active" : ""} onClick={() => setTrans("pending")}>
                <a
                  href="#pending"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  <span>Pending</span>
                </a>
              </li>
              <li className={trans === "" ? "active" : ""} onClick={() => setTrans("all")}>
                <a
                  href="#all"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  <span>All</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <DataTableBody className="border-top" bodyclass="nk-tb-orders">
        <DataTableHead>
          {/* <DataTableRow>
            <span>Order No.</span>
          </DataTableRow> */}
          {
            // <DataTableRow size="sm">
            //   <span>Wallet Address</span>
            // </DataTableRow>
          }

          <DataTableRow size="md">
            <span>Date</span>
          </DataTableRow>
          <DataTableRow size="sm">
            <span>Type</span>
          </DataTableRow>
          {
            // <DataTableRow size="lg">
            //   <span>Ref</span>
            // </DataTableRow>
          }
          <DataTableRow>
            <span>Amount</span>
          </DataTableRow>
          <DataTableRow>
            <span className="d-none d-sm-inline">Status</span>
          </DataTableRow>
          <DataTableRow>
            <span>&nbsp;</span>
          </DataTableRow>
        </DataTableHead>
        {switchTransactions() !== undefined && switchTransactions().length > 0 ? (
          <>
            {switchTransactions()?.map((item, idx) => (
              <DataTableItem key={idx}>
                <DataTableRow size="md">
                  <span className="tb-sub">{moment(item?.created_at).format("MMM D, YYYY h:mma")}</span>
                </DataTableRow>
                {/* <DataTableRow size="sm">
                  <div className="user-card">
                    <div className="user-name">
                      <span
                        className="tb-lead"
                        style={{
                          color: `${
                            item?.type === "deposit" ? "green" : item?.type === "plan_activation" ? "blue" : "red"
                          }`,
                        }}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>
                </DataTableRow> */}
                <DataTableRow>
                  <Badge
                    className="badge-dot badge-dot-xs"
                    color={
                      item?.type === "deposit" ? "success" : item?.type === "plan_activation" ? "warning" : "danger"
                    }
                  >
                    {item?.type === "plan_activation"
                      ? "plan activation"
                      : item?.type === "transfer_out"
                      ? "transfer"
                      : item?.type}
                  </Badge>
                </DataTableRow>
                <DataTableRow>
                  <span className="tb-sub tb-amount">
                    {item?.amount} <span>USD</span>
                  </span>
                </DataTableRow>
                <DataTableRow>
                  <Badge
                    className="badge-dot badge-dot-xs"
                    color={item?.status === "approved" ? "success" : item.status === "Pending" ? "warning" : "danger"}
                  >
                    {item?.status}
                  </Badge>
                </DataTableRow>
              </DataTableItem>
            ))}
          </>
        ) : (
          <div className="empty-transaction">
            <p>No transactions available</p>
            <span role="img" aria-label="Empty Icon" className="empty-icon">
              📝
            </span>
          </div>
        )}
      </DataTableBody>
    </React.Fragment>
  );
};
export default TransactionTable;
