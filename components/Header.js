import React from 'react';
import Head from 'next/head';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();
  // Logout function for btn
  const logout = () => {
    sessionStorage.removeItem('Token');
    router.push('/Login');
  };

  return (
    <>
      <Head>
        <title>School CMS</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar>
        <Container fluid>
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Link href="/">Home</Link>
            <Link href="/Aesscourse">AESS Courses</Link>
            <Button size="sm" variant="dark" onClick={logout}>
              Log Out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
