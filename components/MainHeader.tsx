"use client";

import Link from "next/link";
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from "@/store/store";
import classNames from 'classnames';

// Estilos para el header
const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  padding-left: 2rem;
`;

// Estilos para el enlace
const StyledLink = styled(Link)`
  font-family: 'Inter', sans-serif;
  display: flex;
  font-weight: 500;
  font-size: 16px;
  line-height: 40px;
  letter-spacing: 0.04em;
  text-align: left;
  color: #000;
  text-decoration: none;
`;

const Badge = styled.div`
  width: 75;
  height: 18px;
  border-radius: 6px;
  padding: 4px;
  gap: 4px;
  font-size: 12px;
  margin-left: 20px;

  &.progress {
    background-color: #80808014;
    color: #FFA500;
  }

  &.success {
    background-color: #80808014;
    color: #008000;
  }

  &.error {
    background-color: #80808014;
    color: #FF0000;
  }
`;

const MainHeader = () => {

  const { isSuccess, isError } = useSelector((state: RootState) => state.form)

  const badgeText = isSuccess ? 'success' : isError ? 'error' : 'progress';

  return (
    <StyledHeader>
      <StyledLink href="/">
        New Company
      </StyledLink>
      <Badge className={classNames({ progress: isSuccess === false && isError == false, success: isSuccess === true, error: isError === true })}>{badgeText}</Badge>
    </StyledHeader>
  );
};

export default MainHeader;