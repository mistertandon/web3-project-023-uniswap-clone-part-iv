import React, { useState } from "react";
import Image from "next/image";

import { PoolConnect, PoolAdd } from "./../Components";

const Pools = () => {
  const [closePool, setClosePool] = useState(false);
  return (
    <>
      {closePool ? (
        <PoolAdd setClosePool={setClosePool} />
      ) : (
        <PoolConnect setClosePool={setClosePool} />
      )}
    </>
  );
};

export default Pools;
