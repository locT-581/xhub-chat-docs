/*
Copyright 2025 TekNix Corporation

This software is proprietary and confidential to TekNix Corporation.
All rights reserved. No part of this software may be reproduced, distributed,
or transmitted in any form or by any means, including photocopying, recording,
or other electronic or mechanical methods, without the prior written permission
of TekNix Corporation, except in the case of brief quotations embodied in
critical reviews and certain other noncommercial uses permitted by copyright law.

For permission requests, write to TekNix Corporation at the address below:
TekNix Corporation
Legal Department

UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS STRICTLY PROHIBITED.
*/

import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useRive } from '@rive-app/react-canvas';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';

import CatButton from '../components/catButton';
import FooterRive from '../components/footerRive';
import LightRays from '../components/LightRays';
import ShinyText from '../components/shinyText';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('', styles.heroBanner)}>
      <div className="container" style={{ padding: '4rem 0' }}>
        <div style={{ width: '100%', height: '600px', position: 'absolute', inset: 0 }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>

        <Heading as="h1" className="hero__title" style={{ paddingTop: '5%' }}>
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle" style={{ paddingInline: '20%' }}>
          A modern Chat SDK designed for performance, real-time scalability, and
          {' '}
          <ShinyText text="AI-Powered" />
          {' '}
          conversations.
        </p>
        <div className={styles.buttons}>
          {/* <Link to="/docs/getting-started/quick-start" style={{ zIndex: 100 }}> */}
          <CatButton />
          {/* </Link> */}
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  const { RiveComponent } = useRive({
    src: '/rive/black_cat.riv',
    artboard: 'WCT 01',
    stateMachines: 'BLACK CATW',
    autoplay: true,
  });

  return (
    <Layout
      title={`${siteConfig.title} - Modern Chat SDK`}
      description="Modern, type-safe chat SDK for React and beyond. Build real-time messaging experiences with ease."
    >
      <HomepageHeader />

      <div style={{ width: '25vw', height: '25vh', position: 'absolute', zIndex: 10, top: '20%', left: 0 }}>
        <RiveComponent style={{ width: '100%', height: '100%', marginLeft: '-20%' }} />
      </div>

      <main>
        <HomepageFeatures />
      </main>

      <FooterRive />
    </Layout>
  );
}
