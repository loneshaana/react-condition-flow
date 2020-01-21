import React from "react";
import ReactDOM from "react-dom";
import { FlowChart } from "@mrblenny/react-flow-chart";
import "./styles.css";
import { cloneDeep, mapValues } from "lodash";
import * as actions from "./actions";
import uuid from "uuid";
import {
  CardWrapper,
  CardHeader,
  CardBody,
  CardHeading,
  PortDefaultOuter
} from "./styles";
import styled from "styled-components";

const dropdownvalues = [
  { label: "url", value: "URL" },
  { label: "xpath", value: "XPATH" }
];

const operators = [
  {
    label: "Equal",
    value: "EQUAL"
  },
  {
    label: "NotEqual",
    value: "NOTEQUAL"
  }
];

const DropDown = ({ options, id, onSelect, name }) => {
  return (
    <select id={id} onChange={onSelect} name={name}>
      {options.map(item => (
        <option value={item.value}>{item.label}</option>
      ))}
    </select>
  );
};

const Input = ({ onChange, value, name }) => {
  return <input type="text" onChange={onChange} value={value} name={name} />;
};

function ConditionComponent() {
  return (
    <React.Fragment>
      <DropDown id="condition-dropdown" options={dropdownvalues} />
      <DropDown id="operator-dropdown" options={operators} />
      <Input
        onChange={e => this.onChange(e, this)}
        value={this.value}
        name={this.name}
      />
    </React.Fragment>
  );
}

export const chartSimple = {
  offset: {
    x: 0,
    y: 0
  },
  nodes: {
    node2: {
      id: "node2",
      type: "condition",
      InnerComponent: ConditionComponent,
      onChange: (event, obj) => {
        const { name, value } = event.target;
        obj.value += value;
      },
      name: "input",
      value: "",
      position: {
        x: 300,
        y: 300
      },
      ports: {
        port1: {
          id: "port1",
          type: "input"
        },
        port2: {
          id: "port2",
          type: "output"
        }
      }
    },
    node3: {
      id: "node3",
      type: "input-output",
      position: {
        x: 100,
        y: 600
      },
      ports: {
        port1: {
          id: "port1",
          type: "input"
        },
        port2: {
          id: "port2",
          type: "output"
        }
      }
    },
    node4: {
      id: "node4",
      type: "input-output",
      position: {
        x: 500,
        y: 600
      },
      ports: {
        port1: {
          id: "port1",
          type: "input"
        },
        port2: {
          id: "port2",
          type: "output"
        }
      }
    }
  },
  links: {
    link2: {
      id: "link2",
      from: {
        nodeId: "node2",
        portId: "port2"
      },
      to: {
        nodeId: "node3",
        portId: "port1"
      },
      properties: {
        label: "another example link label"
      }
    },
    link3: {
      id: "link3",
      from: {
        nodeId: "node2",
        portId: "port2"
      },
      to: {
        nodeId: "node4",
        portId: "port1"
      }
    }
  },
  selected: {},
  hovered: {}
};

const Circle = styled.div`
  position: absolute;
  width: 150px;
  height: 150px;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #d30000;
  color: white;
  border-radius: 50%;
`;

const NodeCustom = React.forwardRef(({ node, children, ...rest }, ref) => {
  if (node.type === "condition") {
    const condition = node.condition;
    return (
      <CardWrapper ref={ref} {...rest}>
        <CardHeader>
          <CardHeading>
            {condition.type} {"  "}
            {condition.operator}
          </CardHeading>
        </CardHeader>
        <hr />
        {children}
      </CardWrapper>
    );
  } else {
    return (
      <Circle ref={ref} {...rest}>
        {children}
      </Circle>
    );
  }
});

const NodeInner = React.forwardRef(({ node, ...rest }, ref) => {
  if (node.type === "condition") {
    const { condition } = node;
    return <CardBody>{condition.value}</CardBody>;
  }
});

// custom input on left and output on the right
/**
 * input as arrow
 * output {
 *  yes : tick
 *  no : cross
 * }
 */
const PortCustom = props => (
  <PortDefaultOuter>
    {props.port.properties && props.port.properties.value === "yes" && (
      <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
        <path
          fill="white"
          d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
        />
      </svg>
    )}
    {props.port.properties && props.port.properties.value === "no" && (
      <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
        <path
          fill="white"
          d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
        />
      </svg>
    )}
    {!props.port.properties && (
      <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
        <path
          fill="white"
          d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
        />
      </svg>
    )}
  </PortDefaultOuter>
);
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: {
        x: 0,
        y: 0
      },
      nodes: {},
      links: {},
      selected: {},
      hovered: {},
      newNodes: {
        type: "",
        operator: "",
        value: ""
      }
    };

    this.stateActions = mapValues(actions, func => (...args) =>
      this.setState(func(...args))
    );

    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.createCondition = this.createCondition.bind(this);
  }

  createPort(type) {
    const id = uuid.v4();
    const port = {};
    port[id] = {
      id,
      type
    };
    return port;
  }

  createNode(type, operator, value) {
    const id = uuid.v4();
    const node = {};
    const outputPort = this.createPort("output");
    const inputPort = this.createPort("input");
    node[id] = {
      id: id,
      type: "condition",
      condition: {
        type,
        operator,
        value
      },
      position: {
        x: 300,
        y: 300
      },
      ports: {
        ...outputPort,
        ...inputPort
      }
    };
    return node;
  }

  createCondition() {
    const { type, operator, value } = this.state.newNodes;
    const Node = this.createNode(type, operator, value);

    this.setState(prevState => {
      const existingNodes = Object.assign({}, prevState.nodes, prevState.nodes);
      const newNodes = {
        ...existingNodes,
        ...Node
      };
      return { nodes: newNodes };
    });
  }

  onChange(event) {
    const { name, value } = event.target;
    console.log(name, value);
    this.setState(prevState => {
      const newNodes = Object.assign(
        {},
        prevState.newNodes,
        prevState.newNodes
      );
      newNodes[name] = value;
      return { newNodes };
    });
  }

  onSelect(event) {
    const { name, value } = event.target;
    this.setState(prevState => {
      const newNodes = Object.assign(
        {},
        prevState.newNodes,
        prevState.newNodes
      );
      newNodes[name] = value;
      return { newNodes };
    });
  }

  render() {
    return (
      <div>
        <DropDown
          options={dropdownvalues}
          name="type"
          id="dropdown-options"
          onSelect={this.onSelect}
        />
        <DropDown
          options={operators}
          name="operator"
          id="dropdown-operators"
          onSelect={this.onSelect}
        />
        <Input onChange={this.onChange} name="value" />
        <button type="button" onClick={this.createCondition}>
          Create Condition
        </button>
        <br />
        <button type="button">Create Flow</button>
        <FlowChart
          chart={this.state}
          callbacks={this.stateActions}
          Components={{
            Node: NodeCustom,
            NodeInner: NodeInner,
            Port: PortCustom
          }}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
