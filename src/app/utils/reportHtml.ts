const REPORT_CSS = `
  body { font-family: 'Malgun Gothic', sans-serif; margin: 40px; line-height: 1.4; font-size: 16px; }
  .content-header { text-align: center; margin-bottom: 20px; }
  .header { font-weight: bold; font-size: 30px; margin-bottom: 6px; }
  .date { font-size: 18px; }
  .section-wrap { margin-top: 24px; }
  .section-title { font-weight: bold; font-size: 20px; margin-bottom: 14px; }
  .subsection-title { font-size: 18px; font-weight: bold; margin: 10px 0; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
  th, td { border: 1px solid #000; padding: 8px; text-align: center; vertical-align: middle; }
  th { background-color: #b2b2b2; }
  .header-cell { background-color: #b2b2b2; }
  .bold-header { background-color: #b2b2b2; font-weight: bold; }
  .left-align { text-align: left; }
  .center-align { text-align: center; }
  .note { font-size: 16px; margin: 8px 0 12px 0; }
  .business-section { margin-top: 12px; }
  .business-content { margin-left: 0; }
  .highlight { font-weight: bold; }
`;

function buildStockHoldingsSection(idx: number, s: any): string {
  return `
    <div class="section-wrap">
      <div class="section-title">${idx}. 주식보유 현황</div>
      <table>
        <thead><tr>
          <th>보유주식수</th><th>취득금액</th><th>장부가액</th><th>지분율</th><th>취득사유</th>
        </tr></thead>
        <tbody><tr>
          <td>${s.shares ?? ""}</td>
          <td>${s.acquisitionAmount ?? ""}</td>
          <td>${s.bookValue ?? ""}</td>
          <td>${s.ownershipRatio ?? ""}</td>
          <td class="left-align">${s.acquisitionReason ?? ""}</td>
        </tr></tbody>
      </table>
    </div>`;
}

function buildCompanyOverviewTable(co: any): string {
  const rows: string[] = [];
  if (co.founded || co.ceo || co.capital) {
    rows.push(`<tr>
      <td class="header-cell">설립일</td><td>${co.founded ?? ""}</td>
      <td class="header-cell">대표이사</td><td>${co.ceo ?? ""}</td>
      <td class="bold-header">자본금</td><td>${co.capital ?? ""}</td>
    </tr>`);
  }
  if (co.majorShareholders) rows.push(`<tr><td class="header-cell">주요주주</td><td class="left-align" colspan="5">${co.majorShareholders}</td></tr>`);
  if (co.mainBusiness) rows.push(`<tr><td class="header-cell">주요사업</td><td class="left-align" colspan="5">${co.mainBusiness}</td></tr>`);
  if (co.employees) rows.push(`<tr><td class="header-cell">종업원 현황</td><td class="left-align" colspan="5">${co.employees}</td></tr>`);
  if (co.keyExecutives) rows.push(`<tr><td class="header-cell">핵심임원</td><td class="left-align" colspan="5">${co.keyExecutives}</td></tr>`);
  return `
    <div class="subsection-title"><span class="highlight">1) 회사개요 및 주요 현황</span></div>
    <table><tbody>${rows.join("")}</tbody></table>`;
}

function buildFinancialsTable(f: any): string {
  const periods: string[] = f.periods ?? [];
  const items = [
    { label: "자산총계", key: "totalAssets" },
    { label: "부채총계", key: "totalLiabilities" },
    { label: "자본금", key: "capital" },
    { label: "매출액", key: "revenue" },
    { label: "영업이익", key: "operatingProfit" },
    { label: "당기순이익", key: "netIncome" },
  ].filter(({ key }) => f[key] != null);

  const colWidthPct = periods.length > 0 ? Math.floor(80 / periods.length) : 18;
  const colGroup = `<colgroup>
    <col style="width: 10%" />
    ${periods.map(() => `<col style="width: ${colWidthPct}%" />`).join("")}
    <col style="width: 10%" />
  </colgroup>`;

  const rows = items.map(({ label, key }, idx) => {
    const vals = ((f[key] as any[]) ?? [])
      .map((v: any) => `<td>${v != null ? Number(v).toLocaleString() : ""}</td>`)
      .join("");
    const remarkCell = idx === 0 ? `<td rowspan="${items.length}"></td>` : "";
    return `<tr><td class="header-cell">${label}</td>${vals}${remarkCell}</tr>`;
  });

  return `
    <div class="subsection-title"><span class="highlight">2) 재무현황</span> <span>(단위: 백만원)</span></div>
    <table>
      ${colGroup}
      <thead><tr>
        <th>항 목</th>
        ${periods.map((p) => `<th class="center-align">${p}</th>`).join("")}
        <th>비고</th>
      </tr></thead>
      <tbody>${rows.join("")}</tbody>
    </table>
    <div class="note">▷ 기준 분기 포함 최근 4개 분기 재무현황 (단위: 백만원)</div>`;
}

function buildCompanySection(idx: number, co: any, financials: any): string {
  const parts: string[] = [];
  if (co) parts.push(buildCompanyOverviewTable(co));
  if (financials) parts.push(buildFinancialsTable(financials));
  return `
    <div class="section-wrap">
      <div class="section-title">${idx}. 회사현황</div>
      ${parts.join("")}
    </div>`;
}

function buildBusinessIssuesSection(idx: number, issues: any[]): string {
  const issueHtml = issues
    .map((issue: any) => `<div class="note"><strong>${issue.title ?? ""}</strong>:<br>${issue.content ?? ""}</div>`)
    .join("");
  return `
    <div class="section-wrap">
      <div class="section-title">${idx}. 사업현황 및 주요이슈</div>
      <div class="business-section">
        <div class="business-content">${issueHtml}</div>
      </div>
    </div>`;
}

export function buildReportHtml(data: any): string {
  let sectionIdx = 1;
  const sectionParts: string[] = [];

  if (data.stockHoldings) {
    sectionParts.push(buildStockHoldingsSection(sectionIdx++, data.stockHoldings));
  }

  if (data.companyOverview || data.financials) {
    sectionParts.push(buildCompanySection(sectionIdx++, data.companyOverview, data.financials));
  }

  if (Array.isArray(data.businessIssues) && data.businessIssues.length > 0) {
    sectionParts.push(buildBusinessIssuesSection(sectionIdx++, data.businessIssues));
  }

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.reportTitle ?? "보고서"}</title>
  <style>${REPORT_CSS}</style>
</head>
<body>
  <div class="content-header">
    <div class="header">${data.reportTitle ?? "보고서"}</div>
    <div class="date">${data.reportDate ? `(${data.reportDate})` : ""}</div>
  </div>
  ${sectionParts.join("")}
</body>
</html>`;
}
