import styled from 'styled-components';
import Item from 'react-bootstrap/ListGroupItem';
import Link from 'react-bootstrap/NavLink'
import NavLink from 'react-bootstrap/NavLink'
import Nav from 'react-bootstrap/Nav'
import styleSheet from './styleSheet'
import Button from 'react-bootstrap/Button'

export const EditedTime = styled.div`
    font-size: 0.8em;
    display: flex;
    align-items: flex-end;
    padding-left: 5px;
    color: #999;
`;

export const Primary = styled.div`
    font-size: 1em;
    font-weight: 600;
    color: black;
`

export const Paragraph = styled.p`
    text-align: justify;
    text-justify:inter-ideograph;
    color: black;
`

export const FormFieldName = styled.div`
    color: black;
    font-size: .8rem;
    margin-bottom: 5px;
`

export const PageTitle = styled.div`
    color: black;
    font-size: 1.4rem;
    font-weight: 450;
    text-transform: capitalize;
    margin-bottom: 1rem;
`

export const BOTContainer = styled.div`
    margin: 20px 20px;
`

export const BOTSideNav = styled(NavLink)`
    font-size: 1rem;
    font-weight: 500;
    text-transform: capitalize;
    letter-spacing: 1.2px;
    border-radius: 5px;
    margin-top: 0.5rem;
    color: ${styleSheet.inActive};
    &:hover {
        color: ${styleSheet.theme};
    }
    &:active {
        color: ${styleSheet.theme};
    }
    &.active {
        color: ${styleSheet.theme};
    }
`

export const BOTSideNavTitle = styled.div`
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: black;
    text-transform: capitalize;
`

export const BOTNavLink = styled(Link)`
    font-weight: 500;
    text-transform: capitalize;
    color: ${styleSheet.inActive};
    &.active {
        color: ${styleSheet.theme};
        border-bottom: 3px solid ${styleSheet.theme};
        border-radius: 0px;
    }
    &:hover {
        color: ${styleSheet.theme};
    }
`

export const BOTNav = styled(Nav)`
    border-bottom: 1px solid ${styleSheet.lightGrey};
    margin-bottom: 0;
`

export const LoaderWrapper = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgb(255,255,255,0.8);
`

export const PrimaryButton = styled(Button)`
    font-size: 1rem;
    padding: 0.375rem 0.5rem;
    height: 2.5rem;
    letter-spacing: 1px;
    text-transform: capitalize;
    margin: 0 .2rem;
`

export const NoDataFoundDiv = styled.div`
    padding: 10px 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: white;
    text-transform: capitalize;
`