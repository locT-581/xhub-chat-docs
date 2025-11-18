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
import Heading from '@theme/Heading';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
  gradient: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: '⚡ Lightning Fast',
    emoji: '⚡',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: (
      <>
        Built with performance in mind. IndexedDB caching, optimistic UI updates,
        and efficient state management ensure smooth real-time messaging.
      </>
    ),
  },
  {
    title: '🎯 Type-Safe',
    emoji: '🎯',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: (
      <>
        Fully typed with TypeScript. Get autocomplete, type checking, and
        IntelliSense support throughout your development workflow.
      </>
    ),
  },
  {
    title: '🪝 React Ready',
    emoji: '🪝',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    description: (
      <>
        Powerful React hooks like
        {' '}
        <code>useTimeline</code>
        ,
        {' '}
        <code>useRooms</code>
        ,
        and
        {' '}
        <code>useXHubChat</code>
        {' '}
        make integration seamless and intuitive.
      </>
    ),
  },
  {
    title: '💾 Offline First',
    emoji: '💾',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    description: (
      <>
        Built-in IndexedDB storage with automatic sync. Your app works offline
        and syncs seamlessly when back online.
      </>
    ),
  },
  {
    title: '🔄 Real-time Sync',
    emoji: '🔄',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    description: (
      <>
        Sliding sync protocol ensures efficient real-time updates. Get instant
        message delivery with minimal bandwidth usage.
      </>
    ),
  },
  {
    title: '🧩 Extensible',
    emoji: '🧩',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    description: (
      <>
        Modular architecture with plugin support. Extend functionality with
        custom stores, event handlers, and middleware.
      </>
    ),
  },
];

function Feature({ title, emoji, description, gradient }: FeatureItem) {
  return (
    <div className={clsx('col col--4')} style={{ marginBottom: '2rem' }}>
      <div
        className="feature card-stack"
        style={{
          padding: '2rem',
          borderRadius: '1rem',
          background: 'var(--ifm-background-surface-color)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
          height: '100%',
        }}
      >
        <div className="text--center" style={{ marginBottom: '1rem' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              fontSize: '2.5rem',
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)',
            }}
            className="emoji"
          >
            {emoji}
          </div>
        </div>
        <div className="text--center padding-horiz--md">
          <Heading
            as="h3"
            style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </Heading>
          <p style={{
            color: 'var(--ifm-color-emphasis-700)',
            lineHeight: '1.7',
          }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features} style={{ padding: '4rem 0 0' }}>
      <div className="container">
        <div className="text--center" style={{ marginBottom: '3rem' }}>
          <Heading
            as="h2"
            style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Why Choose XHub Chat?
          </Heading>
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--ifm-color-emphasis-700)',
            maxWidth: '600px',
            margin: '0 auto',
          }}
          >
            Everything you need to build modern, real-time messaging experiences
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>

        {/* Quick Start Section */}
        <div className="text--center" style={{ marginTop: '4rem' }}>
          <div style={{
            padding: '3rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.3)',
          }}
          >
            <Heading
              as="h2"
              style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                color: 'white',
              }}
            >
              Ready to Get Started?
            </Heading>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '2rem',
              opacity: 0.95,
            }}
            >
              Install XHub Chat in your project and start building in minutes
            </p>
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              display: 'inline-block',
              fontFamily: 'var(--ifm-font-family-monospace)',
              fontSize: '1.1rem',
              marginBottom: '2rem',
            }}
            >
              <span className="emoji" style={{ marginRight: '0.5rem' }}>📦</span>
              pnpm add @xhub-chat/core @xhub-chat/react
            </div>
            <div>
              <a
                href="/docs/getting-started/installation"
                className="button button--secondary button--lg"
                style={{
                  marginRight: '1rem',
                  background: 'white',
                  color: '#667eea',
                  fontWeight: '600',
                }}
              >
                📚 Read the Docs
              </a>
              <a
                href="/docs/examples/minimal-example"
                className="button button--outline button--lg"
                style={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: '600',
                }}
              >
                💻 See Examples
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
