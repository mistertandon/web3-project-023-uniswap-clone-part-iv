import React, { useMemo } from "react";

const TokenGrid = ({ tokens, headerListRef }) => {
  console.log("tokens: ", tokens);

  const [headerObj, headerList] = useMemo(() => {
    const headerListTemp = Object.keys(headerListRef);

    let headerObj = {};
    headerListTemp.forEach((header) => {
      headerObj[header] = {
        name: `${header}`,
        displayName:
          header.charAt(0).toUpperCase() + "" + header.slice(1).toLowerCase(),
        className: `${headerListRef[header]}`,
      };
    });
    // const customizedHeaderList = headerListTemp.map((header) => ({
    //   [header]: {
    //     name: `${header}`,
    //     displayName:
    //       header.charAt(0).toUpperCase() + "" + header.slice(1).toLowerCase(),
    //     className: `${headerListRef[header]}`,
    //   },
    // }));
    console.log("headerObj", headerObj);

    return [headerObj, Object.keys(headerObj)];
    // return [[], 1];
  }, [headerListRef]);

  console.log("headerListRef", headerListRef);
  console.log("headerList", headerList);
  console.log("headerObj", headerObj);
  console.log(
    "headerObj['image']['className']",
    headerObj["image"]["className"]
  );

  if (!Array.isArray(headerList) || headerList.length === 0) {
    return <>Grid headers invalid</>;
  }

  return (
    <>
      <article className="max-w-[1440px] mx-[auto] grid grid-cols-12 grid-flow-row gap-4">
        {headerList.map((header) => {
          return (
            <>
              <div className={headerObj[header]["className"]}>
                {headerObj[header].displayName || "N/A"}
              </div>
            </>
          );
        })}
        {tokens.map(({ image, name, symbol, price, change, tvl, volume }) => {
          console.log(headerObj["image"]["className"]);
          return (
            <>
              <div className={headerObj["image"]["className"]}>{image}</div>
              <div className={headerObj["name"]["className"]}>{name}</div>
              <div className={headerObj["symbol"]["className"]}>{symbol}</div>
              <div className={headerObj["price"]["className"]}>{price}</div>
              <div className={headerObj["change"]["className"]}>{change}</div>
              <div className={headerObj["tvl"]["className"]}>{tvl}</div>
              <div className={headerObj["volume"]["className"]}>{volume}</div>
            </>
          );
        })}
      </article>
    </>
  );
};

export default TokenGrid;
