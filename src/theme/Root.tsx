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

import ScrollProgress from '@site/src/components/ScrollProgress';

// Default implementation, that you can customize
export default function Root({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <>
      <ScrollProgress />
      {children}
    </>
  );
}
