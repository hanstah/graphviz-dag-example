import React from "react";
import "./styles.css";
import { Graphviz } from "graphviz-react";
var visualize = require("javascript-state-machine/lib/visualize");
var StateMachine = require("javascript-state-machine");

export default function App() {
  var fsm = new StateMachine({
    transitions: [
      { name: "next", from: "none", to: "validateOperation" },
      { name: "next", from: "validateOperation", to: "createEntity" },
      { name: "next", from: "createEntity", to: "reserveLimit" },
      { name: "next", from: "reserveLimit", to: "createDepositInProvider" },
      { name: "next", from: "createDepositInProvider", to: "rollbackOnRetry" },
      { name: "next", from: "rollbackOnRetry", to: "publishDepositComplete" },
      {
        name: "startRollback",
        from: [
          "createEntity",
          "reserveLimit",
          "createDepositInProvider",
          "rollbackOnRetry"
        ],
        to: "cancelDeposit"
      },
      { name: "unauthorized", from: "validateOperation", to: "unauthorized" },
      {
        name: "accountNotFound",
        from: "validateOperation",
        to: "accountNotFound"
      },
      { name: "next", from: "cancelDeposit", to: "releaseLimit" },
      { name: "next", from: "releaseLimit", to: "publishDepositReverted" },
      {
        name: "next",
        from: [
          "accountNotFound",
          "publishDepositComplete",
          "publishDepositReverted",
          "unauthorized"
        ],
        to: "done"
      }
    ]
  });
  var digraph = visualize(fsm, { orientation: "vertical" });
  console.log(digraph);
  return (
    <Graphviz
      dot={digraph}
      options={{ engine: "dot", height: 800, width: 1024 }}
    />
  );
}
