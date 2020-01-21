import styled from "styled-components";
export const CardWrapper = styled.div`
  position: absolute;
  padding: 0 0 10px;
  margin: 16px auto 0;
  width: 300px;
  font-family: Quicksand, arial, sans-serif;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05), 0 0px 40px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
`;

export const CardHeader = styled.header`
  padding-top: 4px;
  padding-left: 8px;
  padding-bottom: 8px;
`;

export const CardHeading = styled.h1`
  font-size: 18px;
  /* font-weight: bold; */
  text-align: left;
`;

export const CardBody = styled.div`
  padding-right: 32px;
  padding-left: 32px;
`;

export const DarkBox = styled.div`
  position: absolute;
  padding: 30px;
  background: transparent;
  color: black;
  border-radius: 10px;
`;

export const PortDefaultOuter = styled.div`
  width: 24px;
  height: 24px;
  background: cornflowerblue;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;
