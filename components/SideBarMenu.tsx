"use client";

import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from "@/store/store";
import { setSteps } from '@/store/form/slice';
import classNames from 'classnames';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const SideBarContainer = styled.aside`
  display: flex;
  position: relative;
  width: 250px;
  background-color: #f9f9f9;
  margin-right: 20px;

  @media (max-width: 768px) {
    width: 25px; 
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 20px;
  margin: 0;
  width: 100%;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  list-style: none;
  margin-bottom: 1rem;
  font-weight: 500;

  a {
    text-decoration: none;
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 500;
    color: #333;
    display: flex;
    align-items: center;
    
    &:hover {
      color: #4A5AFF;
    }

    &.active {
      color: #4A5AFF;
    }

    @media (max-width: 768px) {
      display: flex;
      align-items: center;
      font-size: 0; /* Oculta solo el texto */
    }
  }
`;

const NumberCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #D9D9D970;
  color: #333;
  text-align: center;
  font-size: 14px;
  margin-right: 2rem;
  font-weight: bold;

  &.active {
    background-color: #4A3AFF;
    color: #fff;
  }

  &.completed {
    background-color: #4ADE80;
    color: #fff;
  }

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const MenuItemText = styled.span`
  display: inline;
  
  @media (max-width: 768px) {
    display: none;
    margin-left: 0.5rem;
  }
`;

const menuItems = [
  { name: "Business structure", href: "/", step: "businessForm" },
  { name: "Contact person", href: "/contactPerson", step: "contactForm" },
  { name: "Review & submit", href: "/review", step: "review" }
];

const SideBarMenu = () => {
  const dispatch = useDispatch();
  const pathname = usePathname()

  const { steps } = useSelector((state: RootState) => state.form)

  useEffect(() => {
    const storedStep = localStorage.getItem('currentStep');
    if(storedStep && storedStep !== '1') {
      switch (storedStep) {
        case '2':
          dispatch(setSteps('businessForm'));
          break;
        case '3':
          dispatch(setSteps('contactForm'));
          break;
        default:
          break;
      }
    }
  },[])

  return (
    <SideBarContainer>
      <MenuList>
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href; // Determina si el enlace es activo
          const isCompleted = steps[item.step as keyof typeof steps]; // Determina cual formulario ya ha sido completado
          return (
            <MenuItem key={index} className={classNames({ active: isActive === true })}>
                <NumberCircle className={classNames({ active: isActive === true, completed: isCompleted === true })}>{isCompleted ? (
                    <Check size={16} />
                  ) : (
                    index + 1
                  )}</NumberCircle>
                <MenuItemText>{item.name}</MenuItemText>
            </MenuItem>
          );
        })}
      </MenuList>
    </SideBarContainer>
  );
}

export default SideBarMenu