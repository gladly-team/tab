// Demo request:
// https://feed.cf-se.com/v2/Search/?gd=SY1002309&q=cola&NumOrganic=6&NumAds=4&sitelinks=TRUE&EnhancedSitelinks=true&rating=TRUE&localad=TRUE&NumSidebar=4&n=2&images=true&videos=true&news=true&relatedsearches=true&UserAgent=Mozilla%2F5.0+%28Windows+NT+6.1%3B+WOW64%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F46.0.2490.71+Safari%2F537.36&UserIp=13.96.0.0&format=json&source=80&url=http%3A%2F%2Fwww.MySite.com&PageIndex=0&EnableProductAds=true

export default async () => ({
  OrganicResults: {
    Items: [
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 5,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Organic&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'COLA.org',
        Description:
          'COLA Inc. is the premier clinical laboratory accreditation, education and consultation organization. We are an independent accreditor whose practical, educational standards have a positive and immediate impact on patient care. Our services enable clinical laboratories and staff to meet CLIA and other regulatory requirements, provide the best ...',
        DisplayUrl: 'www.cola.org',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=http%3A%2F%2Fwww.cola.org%2F&linktype=Organic&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=www.cola.org&resultType=organic',
        DeepLinks: [
          {
            Title: 'Contact Us Page',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Feducation.cola.org%2Fcontact-us-page&linktype=DeepLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=DeepLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
          },
          {
            Title: 'About COLA Inc',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=http%3A%2F%2Fwww.cola.org%2Fcola-clia-certification-accreditation-application%2F&linktype=DeepLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=DeepLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
          },
          {
            Title: 'CLIA Application for Accreditation',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=http%3A%2F%2Fwww.cola.org%2Flab-testing-accreditation-quality%2Fclia-application-clia-accreditation%2F&linktype=DeepLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=DeepLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
          },
          {
            Title: 'Education & Resources',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=http%3A%2F%2Fwww.cola.org%2Feducation-resources%2F&linktype=DeepLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=DeepLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
          },
          {
            Title: 'Stay in Touch',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=http%3A%2F%2Fwww.cola.org%2Fstay-in-touch-with-cola%2F&linktype=DeepLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=DeepLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
          },
          {
            Title: 'LabGuides/Ebooks',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=http%3A%2F%2Fwww.cola.org%2Feducation-resources%2Flabguides-ebooks%2F&linktype=DeepLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=DeepLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=5&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
          },
        ],
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 6,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Organic&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=6&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Cost-of-Living Adjustment (COLA) Information | Social ...',
        Description:
          'Your COLA Notice. In December 2019, Social Security COLA notices will be available online to most beneficiaries in the Message Center of their my Social Security.. This is a secure, convenient way to receive COLA notices online and save the message for later.',
        DisplayUrl: 'https://www.ssa.gov/news/cola',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.ssa.gov%2Fnews%2Fcola%2F&linktype=Organic&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=6&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=https%3A%2F%2Fwww.ssa.gov%2Fnews%2Fcola&resultType=organic',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 8,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Organic&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=8&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Overseas COLA Calculator',
        Description:
          'Allowances > Overseas Cost of Living Allowances (COLA) > Overseas COLA Calculator Overseas COLA Calculator. To calculate your Overseas COLA rate, select the Year, Month, Period, Locality Name or Code, and Member Information from the drop-downs below. Click Calculate when complete.',
        DisplayUrl: 'https://www.defensetravel.dod.mil/site/colaCalc.cfm',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.defensetravel.dod.mil%2Fsite%2FcolaCalc.cfm&linktype=Organic&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=8&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=https%3A%2F%2Fwww.defensetravel.dod.mil%2Fsite%2FcolaCalc.cfm&resultType=organic',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 9,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Organic&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=9&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Cola - Wikipedia',
        Description:
          "Cola is a sweetened, carbonated soft drink flavored with vanilla, cinnamon, citrus oils and other flavorings. Most contain caffeine, which was originally sourced from the kola nut, leading to the drink's name, though other sources are now also used.Cola became popular worldwide after pharmacist John Pemberton invented Coca-Cola in 1886. His non-alcoholic recipe was inspired by the coca wine of ...",
        DisplayUrl: 'https://en.wikipedia.org/wiki/Cola',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FCola&linktype=Organic&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=9&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FCola&resultType=organic',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 12,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Organic&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=12&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Latest Cost-of-Living Adjustment',
        Description:
          'What is a COLA? Legislation enacted in 1973 provides for cost-of-living adjustments, or COLAs. With COLAs, Social Security and Supplemental Security Income (SSI) benefits keep pace with inflation. Latest COLA The latest COLA is 1.6 percent for Social Security benefits and SSI payments.',
        DisplayUrl: 'https://www.ssa.gov/OACT/COLA/latestCOLA.html',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.ssa.gov%2FOACT%2FCOLA%2FlatestCOLA.html&linktype=Organic&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=12&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=https%3A%2F%2Fwww.ssa.gov%2FOACT%2FCOLA%2FlatestCOLA.html&resultType=organic',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 13,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Organic&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=13&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Camelphat & Elderbrook ‘Cola’ - YouTube',
        Description:
          '‘Cola’ had barely touched the ground when tastemakers’ ears were pricking up across the board. Having become a byword for quality house music, remaining at the #1 Beatport spot for over a ...',
        DisplayUrl: 'https://www.youtube.com/watch?v=qke-jOUqSXU',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dqke-jOUqSXU&linktype=Organic&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=13&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dqke-jOUqSXU&resultType=organic',
      },
    ],
    NumResults: 111000000,
  },
  SponsoredResults: {
    Items: [
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 1,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Sponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=enha&resultType=sponsored',
        pid: 2,
        Title: 'Coca Cola (Now Hiring)',
        Description:
          'Apply Online Now. Hiring for Immediate Openings in Your Area.',
        DisplayUrl: 'Coca-Cola.localjobster.com',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8aYhfi8FoPaKwfBQAO87FQDVUCUw3X8ZH4CKDzB72KGP_j8LtjAuowYFWEeCb0V3GikaZ5MVaIO_Lb--bU9vfzOaSq3yzdpTXv-4N1dLmVHwRkk_PAiMUGRkGBGdtCOl7o_-P_E1X3AZs3XNIdTTG4gxoY6A%26u%3Dd3d3LmxvY2Fsam9ic3Rlci5jb20lMmZicyUyZjExMjkwMmNmNDElM2Zjb21wYW55JTNkQ29jYSUyYkNvbGElMjZzX25ldHdvcmslM2RTZWFyY2glMjZzX2t3JTNka3dkLTc1NjYwMjY5MTg3NTY0JTNhbG9jLTE5MCUyNnNfYWQlM2Q3NTY2MDE0Njg2MjI5MSUyNnNfcXMlM2Rjb2xhJTI2dXRtX3NvdXJjZSUzZE1pY3Jvc29mdCUyNnV0bV90ZXJtJTNkNzU2NjAyNjkxODc1NjQlMjZtX3R5cGUlM2RiYiUyNnV0bV9jYW1wYWlnbiUzZDExMDA0MTEzMCUyNnV0bV9jb250ZW50JTNkNzExNDMxMDQzJTI2bXNjbGtpZCUzZGU4Y2IwMmI3MGRkMDFmZDY3ZjY1NWM1NWJkNzZkZDBk%26rlid%3De8cb02b70dd01fd67f655c55bd76dd0d&linktype=Sponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=enha&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=Coca-Cola.localjobster.com&resultType=sponsored',
        SiteLinks: [
          {
            Text: 'Apply Now',
            DescriptionLine1: 'Increase your chance of getting',
            DescriptionLine2: 'hired - apply for more positions.',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8YjnmJLfLxsD2IPDISpaFUTVUCUxumT5upRGdN7v3p9qQPRMygxnGuA-XF1uD-MHby3PQ492Tn6sQHrjytg_bYp-e3r2wEi1rZFWCqrXfo66TbmtIP0qgIWoCjeDJLE1XDRcUcj4EOfKVQXMw5Fd05o0UQEwj45H5A6FyLRvhKw6DX8ys%26u%3Dd3d3LmxvY2Fsam9ic3Rlci5jb20lMmZicyUyZjExMjkwMmNmNDElM2Zjb21wYW55JTNkQ29jYSUyNTIwQ29sYSUyNnNfbmV0d29yayUzZFNlYXJjaCUyNnNfa3clM2Rrd2QtNzU2NjAyNjkxODc1NjQlM2Fsb2MtMTkwJTI2c19hZCUzZDc1NjYwMTQ2ODYyMjkxJTI2c19xcyUzZGNvbGElMjZ1dG1fc291cmNlJTNkTWljcm9zb2Z0JTI2dXRtX2NhbXBhaWduJTNkMTEwMDQxMTMwJTI2dXRtX3Rlcm0lM2Q3NTY2MDI2OTE4NzU2NCUyNm1fdHlwZSUzZGJiJTI2dXRtX2NvbnRlbnQlM2Q3MTE0MzEwNDMlMjZtc2Nsa2lkJTNkYzVlM2FmMDI4MWYxMTFlNDVjNzdmMWUwMzE1NzUzMjE%26rlid%3Dc5e3af0281f111e45c77f1e031575321&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=enha&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=sponsored',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=enha&resultType=sponsored',
          },
          {
            Text: 'About the Company',
            DescriptionLine1: 'See available jobs and find out',
            DescriptionLine2: 'what current employees have to say.',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8-d87pTF8xvlGcpY_OMLe8jVUCUzFgyisbYGg9OUBG42NKzkQ5ZXQbq2JDTH-erhIwxOLNNDycUMJHjlyskEzHdr5boVWejWCy6JqUjDERX25UgwdaKKwXSUSB3Mk6xATTn8JzQSUVjzv4IBjFMXRPKLF42QCK1HJxZHuPz0bht1T4Dm4%26u%3Dd3d3LmxvY2Fsam9ic3Rlci5jb20lMmZicyUyZjExMjkwMmNmNDElM2Zjb21wYW55JTNkQ29jYSUyNTIwQ29sYSUyNnNfbmV0d29yayUzZFNlYXJjaCUyNnNfa3clM2Rrd2QtNzU2NjAyNjkxODc1NjQlM2Fsb2MtMTkwJTI2c19hZCUzZDc1NjYwMTQ2ODYyMjkxJTI2c19xcyUzZGNvbGElMjZ1dG1fc291cmNlJTNkTWljcm9zb2Z0JTI2dXRtX2NhbXBhaWduJTNkMTEwMDQxMTMwJTI2dXRtX3Rlcm0lM2Q3NTY2MDI2OTE4NzU2NCUyNm1fdHlwZSUzZGJiJTI2dXRtX2NvbnRlbnQlM2Q3MTE0MzEwNDMlMjZtc2Nsa2lkJTNkZWU0NGE1NDZjNWRhMWFkNzc1MzBmYmE0NzU3Y2ZlZTE%26rlid%3Dee44a546c5da1ad77530fba4757cfee1&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=enha&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=sponsored',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=enha&resultType=sponsored',
          },
          {
            Text: 'Career Tools',
            DescriptionLine1: 'Get help creating resumes and cover',
            DescriptionLine2: 'letters that will get you noticed.',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De89hrRLn42ZSbmn7VP0-QAjDVUCUxZMK9ExkAHil7sp4R6XezjRan6zRIjzuqm4VGCEEFNhI5fom66AYKQxWHeg18fzmXd7x1b0bS8RtXJWwoZ0d6Po0pegDqHQKbuIGzMFQqdjAiAhM-drjrJ6_755fiqXADQpd41Zs54_1OdYaSNukV5%26u%3Dd3d3LmxvY2Fsam9ic3Rlci5jb20lMmZicyUyZjExMjkwMmNmNDElM2Zjb21wYW55JTNkQ29jYSUyNTIwQ29sYSUyNnNfbmV0d29yayUzZFNlYXJjaCUyNnNfa3clM2Rrd2QtNzU2NjAyNjkxODc1NjQlM2Fsb2MtMTkwJTI2c19hZCUzZDc1NjYwMTQ2ODYyMjkxJTI2c19xcyUzZGNvbGElMjZ1dG1fc291cmNlJTNkTWljcm9zb2Z0JTI2dXRtX2NhbXBhaWduJTNkMTEwMDQxMTMwJTI2dXRtX3Rlcm0lM2Q3NTY2MDI2OTE4NzU2NCUyNm1fdHlwZSUzZGJiJTI2dXRtX2NvbnRlbnQlM2Q3MTE0MzEwNDMlMjZtc2Nsa2lkJTNkNDc4ZWEyMWE4NjdjMWJhN2ZlMmRmY2Y4MzZkYTY4MWQ%26rlid%3D478ea21a867c1ba7fe2dfcf836da681d&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=enha&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=sponsored',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=enha&resultType=sponsored',
          },
          {
            Text: 'See New Openings',
            DescriptionLine1: 'See the latest positions that',
            DescriptionLine2: 'have just opened up near you.',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8CNDVwQi-KgQzcx3cNeb5gDVUCUy6Yqi3vq66XJhDqsZhKsGI3Tff9awi8caVPbw-E5-SGWeIfkfQyvi-vOX8pnTOzGdLm06iYJGHH1PNTtC0LDDV2mT4DR0MffzQySN0d4yRofBLAgLTZ3lSlLeaRTFVlbjG3zIJLjpdvfXU8brp0gGb%26u%3Dd3d3LmxvY2Fsam9ic3Rlci5jb20lMmZicyUyZjExMjkwMmNmNDElM2Zjb21wYW55JTNkQ29jYSUyNTIwQ29sYSUyNnNfbmV0d29yayUzZFNlYXJjaCUyNnNfa3clM2Rrd2QtNzU2NjAyNjkxODc1NjQlM2Fsb2MtMTkwJTI2c19hZCUzZDc1NjYwMTQ2ODYyMjkxJTI2c19xcyUzZGNvbGElMjZ1dG1fc291cmNlJTNkTWljcm9zb2Z0JTI2dXRtX2NhbXBhaWduJTNkMTEwMDQxMTMwJTI2dXRtX3Rlcm0lM2Q3NTY2MDI2OTE4NzU2NCUyNm1fdHlwZSUzZGJiJTI2dXRtX2NvbnRlbnQlM2Q3MTE0MzEwNDMlMjZtc2Nsa2lkJTNkMzU1N2MxOGJiYzI4MWYwMWIyY2M5ZjY5MGM4ZTE4OWE%26rlid%3D3557c18bbc281f01b2cc9f690c8e189a&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=enha&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=sponsored',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=enha&resultType=sponsored',
          },
        ],
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 2,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Sponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=2&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=sponsored',
        pid: 2,
        Title: 'Low Price Coca Cola Clothing - Currently On Sale',
        Description:
          'Find The Best Deals For Coca Cola Clothing. Compare Prices Online And Save Today!',
        DisplayUrl: 'www.myloveluxe.store/Coca Cola Clothing',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8tM333SrIaEELwEfPj_1ZNDVUCUyzUJT5APG_B4pkI0bXFDl3VjBxGITGCovBQBZ46tsNszp9DMkGZL8b6w4C6D6E0pYdg2LEjLiGNPHZf8UhSAPBCM-2LPC-3o-tvqd1-9jS6_hTli_6R_gtAEazcvDYlNQ%26u%3DaHR0cHMlM2ElMmYlMmZ3d3cubXlsb3ZlbHV4ZS5zdG9yZSUyZnNlcnAlM2ZzZWdtZW50JTNkbWxscm1nNDQlMjZxJTNkQ29jYSUyYkNvbGElMmJDbG90aGluZyUyNnV0bV9zb3VyY2UlM2RCaW5nJTI2bWxsY2lkJTNkMzk1NDczNTQ4JTI2bWxsYWdpZCUzZDEzMzgxMDYwNzU2NjgxMTklMjZtbGxraWQlM2RhZjVmOWE0ZTM0NzgxZGFmMDAzN2M0YWM4NGRlYjM2NiUyNm1zY2xraWQlM2RhZjVmOWE0ZTM0NzgxZGFmMDAzN2M0YWM4NGRlYjM2Ng%26rlid%3Daf5f9a4e34781daf0037c4ac84deb366&linktype=Sponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=2&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=www.myloveluxe.store%2FCoca%20Cola%20Clothing&resultType=sponsored',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 3,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Sponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&resultType=sponsored',
        pid: 2,
        Title: 'Places to stay in Cola - Filter by Free Cancellation',
        Description:
          'Book your Hotel in Cola online. No reservation costs. Great rates.',
        DisplayUrl: 'www.booking.com/Cola/Hotels',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De87ghlmFR0XRZMQCrv4_WkxjVUCUwNYNoAuYzMLcaaoS69C_B6XuvZVZwG3npuHBZPZODzgOhA79os2tbIr9-O5xrm7gg6ndRMjKYUi73aGhdgl9qwbJehNU5lnEJWYW0SsJZYgWh8ZakCNuTqAYRA-GHeihE%26u%3DaHR0cCUzYSUyZiUyZnd3dy5ib29raW5nLmNvbSUyZmNpdHklMmZpbiUyZmNvbGEuZW4uaHRtbCUzZmFpZCUzZDM0NzM0OSUyNmxhYmVsJTNkbXNuLS04MDQwMTg4NzE0NDU4MiUzYXRpa3dkLTE3NDI3NjYxOTk1JTNhbmVzJTNhbXRlJTNhZGVjJTNhcXNjb2xhJTI2dXRtX2NhbXBhaWduJTNkSW5kaWElMjZ1dG1fbWVkaXVtJTNkY3BjJTI2dXRtX3NvdXJjZSUzZGJpbmclMjZ1dG1fdGVybSUzZCUyNm1zY2xraWQlM2QyODNjODE3OTAwN2YxZmYzYmJhNGRmOWJiMGQ5ZTg1NA%26rlid%3D283c8179007f1ff3bba4df9bb0d9e854&linktype=Sponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=www.booking.com%2FCola%2FHotels&resultType=sponsored',
        SiteLinks: [
          {
            Text: 'Luxury Hotels',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8UW6G9KW95Fmn7CdpTE70pDVUCUzaiXQkNlZO3nFfi37N00eF-gdgI8BXCV7EfBlcQtopw_J-SSSn6U6Uxhm6LNxJgVEBlWdy8RRV6a6dO5eN1gzUYK7PhUK8IQ85dnM1O5Fxa3-ZUJ9WIiQ6qWyIZX541N_KF5evZyMS2FqQvzO1VLDR%26u%3DaHR0cCUzYSUyZiUyZnd3dy5ib29raW5nLmNvbSUyZmdvLmh0bWwlM2ZzbGMlM2RsdSUzYmFpZCUzZDM0NzM0OSUyNmxhYmVsJTNkbXNuLS04MDQwMTg4NzE0NDU4MiUzYXRpa3dkLTE3NDI3NjYxOTk1JTNhbmVzJTNhbXRlJTNhZGVjJTNhcXNjb2xhJTI2dXRtX2NhbXBhaWduJTNkSW5kaWElMjZ1dG1fbWVkaXVtJTNkY3BjJTI2dXRtX3NvdXJjZSUzZGJpbmclMjZ1dG1fdGVybSUzZCUyNm1zY2xraWQlM2QzYTljM2EwZTg1ZWUxZTcyYWRiMTY0ZWMzNTQ4MWMwZg%26rlid%3D3a9c3a0e85ee1e72adb164ec35481c0f&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=sponsored',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&resultType=sponsored',
          },
          {
            Text: 'Budget Hotels',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8CGT5zVw2e5YOEQAEHQOsaDVUCUy_TqiOvpSzdgjy5wBcQ15-97WPrBjL98pjtcwit0bNf-NB-q9ZLLtAH5qxfUdlG9yRt7YTepPbcLgFbHDIfxMKr1eAYk9wKJBK48bELV1G-tFNQCSMFE4JKuxPk4w6RVA-S0osOSOXSew69d9cq1RC%26u%3DaHR0cCUzYSUyZiUyZnd3dy5ib29raW5nLmNvbSUyZmdvLmh0bWwlM2ZzbGMlM2RidSUzYmFpZCUzZDM0NzM0OSUyNmxhYmVsJTNkbXNuLS04MDQwMTg4NzE0NDU4MiUzYXRpa3dkLTE3NDI3NjYxOTk1JTNhbmVzJTNhbXRlJTNhZGVjJTNhcXNjb2xhJTI2dXRtX2NhbXBhaWduJTNkSW5kaWElMjZ1dG1fbWVkaXVtJTNkY3BjJTI2dXRtX3NvdXJjZSUzZGJpbmclMjZ1dG1fdGVybSUzZCUyNm1zY2xraWQlM2RhYmU4ODc2ZTAzYzAxNDA5M2VmY2Q5OGNiMzY2Yzg4YQ%26rlid%3Dabe8876e03c014093efcd98cb366c88a&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=sponsored',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&resultType=sponsored',
          },
          {
            Text: 'Book for Tomorrow',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8OPt3QTm81852r2w-phSYpjVUCUwMYPdIBaDTEZM06_sT3IRU8mtfJqCXfV8IqnAA0Yokg_m9haRVC1_N1Bt3FVg_p6ZBfqDdwfHMRnErKe5JKO5EUTeNrPRWc-xaK7ZkJscTt0xDFR-DkFvHnRtwDqXyu7LhZn2UP79Ir9UPyfHHTIa9%26u%3DaHR0cCUzYSUyZiUyZnd3dy5ib29raW5nLmNvbSUyZmdvLmh0bWwlM2ZzbGMlM2RiMiUzYmFpZCUzZDM0NzM0OSUyNmxhYmVsJTNkbXNuLS04MDQwMTg4NzE0NDU4MiUzYXRpa3dkLTE3NDI3NjYxOTk1JTNhbmVzJTNhbXRlJTNhZGVjJTNhcXNjb2xhJTI2dXRtX2NhbXBhaWduJTNkSW5kaWElMjZ1dG1fbWVkaXVtJTNkY3BjJTI2dXRtX3NvdXJjZSUzZGJpbmclMjZ1dG1fdGVybSUzZCUyNm1zY2xraWQlM2Q3NGY2ZTNmYWRkM2UxY2EyYzcwNGJkMTg2ZDk4MzkyMg%26rlid%3D74f6e3fadd3e1ca2c704bd186d983922&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=sponsored',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&resultType=sponsored',
          },
          {
            Text: 'Book for Tonight',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De82CbeuGfOK_b6pshbckpeJDVUCUzsuiSlQAvuBWtv-nXoZhRakJCiuZWG9LTY4wjwTmL2EoR4vPZj7r3Gbx1s8ti0fm3AXAIZdPIl6enZY5VjR6EC9y19qLoPVoYJCV5gM955-aF44PWArJcI5BUW7XTFEM4UW8_9AUK8ZMiTrLVqztlc%26u%3DaHR0cCUzYSUyZiUyZnd3dy5ib29raW5nLmNvbSUyZmdvLmh0bWwlM2ZzbGMlM2RiMSUzYmFpZCUzZDM0NzM0OSUyNmxhYmVsJTNkbXNuLS04MDQwMTg4NzE0NDU4MiUzYXRpa3dkLTE3NDI3NjYxOTk1JTNhbmVzJTNhbXRlJTNhZGVjJTNhcXNjb2xhJTI2dXRtX2NhbXBhaWduJTNkSW5kaWElMjZ1dG1fbWVkaXVtJTNkY3BjJTI2dXRtX3NvdXJjZSUzZGJpbmclMjZ1dG1fdGVybSUzZCUyNm1zY2xraWQlM2QxYTc3OWU5N2NjOTIxZDk1YmMwNWMwNzU3YzM0ODJiNg%26rlid%3D1a779e97cc921d95bc05c0757c3482b6&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=sponsored',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&resultType=sponsored',
          },
          {
            Text: 'Book Now',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8mkiIYWQvd4zjCVvPMvpPpDVUCUzb9Jgo1c8teFq-JHMx8jiIAevY6AIvtDC_jq2fWhT_2pGJgXRajXu7MdVXhE-aMq4aVUKKWPH7bfQTLAiilescVG559kMn6BQTHVsVwBdpE3B5duO7rRP23Kw3wXCXoVBz4tKCdDANFxSGBQTW7Gnd%26u%3DaHR0cCUzYSUyZiUyZnd3dy5ib29raW5nLmNvbSUyZmdvLmh0bWwlM2ZzbGMlM2RibiUzYmFpZCUzZDM0NzM0OSUyNmxhYmVsJTNkbXNuLS04MDQwMTg4NzE0NDU4MiUzYXRpa3dkLTE3NDI3NjYxOTk1JTNhbmVzJTNhbXRlJTNhZGVjJTNhcXNjb2xhJTI2dXRtX2NhbXBhaWduJTNkSW5kaWElMjZ1dG1fbWVkaXVtJTNkY3BjJTI2dXRtX3NvdXJjZSUzZGJpbmclMjZ1dG1fdGVybSUzZCUyNm1zY2xraWQlM2Q2YmU1NmY4ZDNhNTMxZDUzZjVmMzMxNmY4YWY1MmM5Nw%26rlid%3D6be56f8d3a531d53f5f3316f8af52c97&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=sponsored',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&resultType=sponsored',
          },
          {
            Text: 'No Booking Fees',
            TargetedUrl:
              'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8YobUZh68mjyRI5ZO-z3qizVUCUymB4JVlaXSi6iVgrx3ZgQ2nZVj1JbrfKSQHgVko5sa5b6ykEQVmKvn0R8O0Yg9BcFblVgHm15_SuaxakiNnfQJoiO2mDy-srcACeb22nqjZw5plvrojbqB4egbZIc-b7vJzXFSEtHU0tphQu6uo2td%26u%3DaHR0cCUzYSUyZiUyZnd3dy5ib29raW5nLmNvbSUyZmdvLmh0bWwlM2ZzbGMlM2RuYiUzYmFpZCUzZDM0NzM0OSUyNmxhYmVsJTNkbXNuLS04MDQwMTg4NzE0NDU4MiUzYXRpa3dkLTE3NDI3NjYxOTk1JTNhbmVzJTNhbXRlJTNhZGVjJTNhcXNjb2xhJTI2dXRtX2NhbXBhaWduJTNkSW5kaWElMjZ1dG1fbWVkaXVtJTNkY3BjJTI2dXRtX3NvdXJjZSUzZGJpbmclMjZ1dG1fdGVybSUzZCUyNm1zY2xraWQlM2Q0NjZkNmNiOWU0N2QxMzdkYzM5MTMyNWI1NGRiZDlkNw%26rlid%3D466d6cb9e47d137dc391325b54dbd9d7&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=sponsored',
            PixelUrl:
              'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SiteLink&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3_s&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&resultType=sponsored',
          },
        ],
        MerchantRatings: {
          StarRating: 4.5,
          StarRatingUrl:
            'https://storage2.stgbssint.com/Resources/Icons/4_5.png',
          TargetedUrl:
            'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fstorage2.stgbssint.com%2FResources%2FIcons%2F4_5.png&linktype=Merchantrating&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=sponsored',
          NumberOfReviews: 369995,
          PixelUrl:
            'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Merchantrating&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=3&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=site_mer&resultType=sponsored',
        },
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 4,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Sponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=4&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=sponsored',
        pid: 2,
        Title: 'Coca Cola Company - Get The Best Xmas Deal',
        Description:
          'Coca Cola Company - Now on Sale Quick, Limited Time , Save Today!',
        DisplayUrl: 'www.christmas-sales-online.com/Coca Cola Company',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8d15d6aVDazAqrszeAMaKsDVUCUxZWPJa66Jo0aesNK4Z4g3N3Pw4sgSMEX5fMMQpqmnsimCn2G5vmsxANcb7hprTE3QjeSR9XvJ9DeGfdov3Q_oVZxtidJWzzO-8rzYrKG0v40a69k3Xf4ycNFfoedP0gSA%26u%3DaHR0cHMlM2ElMmYlMmZjaHJpc3RtYXMtc2FsZXMtb25saW5lLmNvbSUyZmNzbzEwJTJmY29jYSUyNTIwY29sYSUyNTIwY29tcGFueSUzZnV0bV9zb3VyY2UlM2RCaW5nJTI2cm1nY2lkJTNkMzg1ODgzMDQyJTI2cm1nYWdpZCUzZDExNTY2ODY3MDE5NDYwODIlMjZybWdraWQlM2Q1NDI4NmYwMDFhNWQxMzBjZmZmNDMxZTJhYWZiODQzOSUyNm1zY2xraWQlM2Q1NDI4NmYwMDFhNWQxMzBjZmZmNDMxZTJhYWZiODQzOQ%26rlid%3D54286f001a5d130cfff431e2aafb8439&linktype=Sponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=4&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=www.christmas-sales-online.com%2FCoca%20Cola%20Company&resultType=sponsored',
      },
      {
        Metadata: {},
        PlacementHint: 'Sidebar',
        Rank: 1,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SideSponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1001&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=mer&resultType=sponsored',
        pid: 2,
        Title: 'Cola Surname Origin - Meaning, Nationality & More',
        Description:
          'Learn All About Cola Family Name Origins & Meanings at MyHeritage™!',
        DisplayUrl: 'lastnames.myheritage.com/Cola/Meaning',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8FBHw4UlDuZOa72okSZu0eDVUCUzINU4nFGormJBprsmg0FMfHR5g7U3nh-HcfDtMWm77D9ky32SExoTezNurznjtFLh6bF1_jKJStnvMUEvJoqDHb6R3miWv-hQWgtSOEzW1nvTyzZGV5objFyaDktJ2TMY%26u%3DaHR0cCUzYSUyZiUyZmNsaWNrc2VydmUuZGFydHNlYXJjaC5uZXQlMmZsaW5rJTJmY2xpY2slM2ZsaWQlM2Q0MzcwMDAzMzYyNjI4NjgzMyUyNmRzX3Nfa3dnaWQlM2Q1ODcwMDAwNDA5MjQzODM3MSUyNmRzX2FfY2lkJTNkNDA3NTc0NjQ0JTI2ZHNfYV9jYWlkJTNkOTMzMTg1NDkyNiUyNmRzX2FfYWdpZCUzZDk3MzM0MDg2NTQ3JTI2ZHNfYV9saWQlM2Rrd2QtOTQzMjgwMTUlMjYlMjZkc19lX2FkaWQlM2Q3MzgwNDg0NjcxMjIyNSUyNmRzX2VfdGFyZ2V0X2lkJTNka3dkLTczODA0ODA5MjI2MjQyJTNhbG9jLTE5MCUyNiUyNmRzX3VybF92JTNkMiUyNmRzX2Rlc3RfdXJsJTNkaHR0cHMlM2ElMmYlMmZsYXN0bmFtZXMubXloZXJpdGFnZS5jb20lMmZsYXN0LW5hbWUlMmZjb2xhJTNmdmFyJTNkcGFydG5lcnMlMjZ1dG1fc291cmNlJTNkcHBjX2JpbmclMjZ1dG1fbWVkaXVtJTNkY3BjJTI2dXRtX2NhbXBhaWduJTNkJTViKkNhbXBhaWduKiU1ZCUyNnV0bV9jb250ZW50JTNkNzM4MDQ4NDY3MTIyMjUlMjZ1dG1fdGVybSUzZCU1YipzZWFyY2h0ZXJtKiU1ZCUyNnRyX2NhbXBfaWQlM2QyNjg2Mjc2NDclMjZ0cl9hZF9ncm91cCUzZCU1YipBZGdyb3VwKiU1ZCUyNnRyX2FnX2lkJTNkMTE4MDg3NjA0NTMzODYwMCUyNnRyX2RldmljZSUzZGMlMjZ0cl9hY2NvdW50JTNkRjEwNzRFRU4lMjZtc2Nsa2lkJTNkZmVjMzQ1MjU1ZjZmMTczNzYyM2MxYmM3ZWZjOTM2YWU%26rlid%3Dfec345255f6f1737623c1bc7efc936ae&linktype=SideSponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1001&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=mer&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=lastnames.myheritage.com%2FCola%2FMeaning&resultType=sponsored',
        MerchantRatings: {
          StarRating: 4.5,
          StarRatingUrl:
            'https://storage2.stgbssint.com/Resources/Icons/4_5.png',
          TargetedUrl:
            'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fstorage2.stgbssint.com%2FResources%2FIcons%2F4_5.png&linktype=Merchantrating&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1001&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=mer&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=sponsored',
          NumberOfReviews: 524,
          PixelUrl:
            'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Merchantrating&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1001&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&adExtComb=mer&resultType=sponsored',
        },
      },
      {
        Metadata: {},
        PlacementHint: 'Sidebar',
        Rank: 2,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SideSponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1002&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=sponsored',
        pid: 2,
        Title: 'Coca Cola Official Website - Free Coupons And Discounts',
        Description:
          'Save Money With The Latest Free Coupon Codes, Promos & Discounts, Updated Daily.',
        DisplayUrl: 'www.coupon-cheap.com',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8QwnGGnEgdCP-2kFT-2ccHzVUCUyBIDCY-mFyW5fv6ZfVhGsMQZoYCaZd381RfJ6xUx07zlJL53ywkCWa2RQxlCyGs0ywgbS4DgAYNE7vZ0_vjcpl3_dOXuRl8Ceyx8mUPhrOSoD9iIJTAkT14_8y4Tg7QVk%26u%3DaHR0cHMlM2ElMmYlMmZ3d3cuY291cG9uLWNoZWFwLmNvbSUyZmNvdXBvbnMlMmZjb2NhLWNvbGElMmYlM2Z1dG1fc291cmNlJTNkYmluZyUyNnV0bV9tZWRpdW0lM2RjcGMlMjZ1dG1fdGVybSUzZGNvY2Fjb2xhY291cG9uMSUyNnV0bV9jYW1wYWlnbiUzZHVzYnJhbmQzNWQ%26rlid%3Dd213fcb24e8113a1519da250fe272455&linktype=SideSponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1002&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=www.coupon-cheap.com&resultType=sponsored',
      },
      {
        Metadata: {},
        PlacementHint: 'Sidebar',
        Rank: 3,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SideSponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1003&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=sponsored',
        pid: 2,
        Title: 'Vintage Coca-cola On eBay - Free Shipping On Many Items',
        Description:
          'Free Shipping Available. Buy on eBay. Money Back Guarantee!',
        DisplayUrl: 'www.ebay.com',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De8Yaejv6Eus2Yx0TOUW_enaTVUCUzFtYCPwBo1cQUS7LIk2nvPqDo09ZEXSbzTCgdC7-l2__mq7AeK9TuDIFJ_8YTGCivE5csxxPckS-U7vVcbj_vxHdaMnxIVuBRCncgX7o3II1QVWGasQktC9R_073wdB44%26u%3DaHR0cCUzYSUyZiUyZnd3dy5lYmF5LmNvbSUyZnVsayUyZnNjaCUyZiUzZl9ua3clM2R2aW50YWdlJTI1MjBjb2NhLWNvbGElMjZub3JvdmVyJTNkMSUyNm1rZXZ0JTNkMSUyNm1rcmlkJTNkNzExLTM0MDAwLTEzMDc4LTAlMjZta2NpZCUzZDIlMjZrZXl3b3JkJTNkdmludGFnZSUyNTIwY29jYS1jb2xhJTI2Y3JscCUzZF8yMDE4MDIlMjZNVF9JRCUzZCUyNmdlb19pZCUzZCUyNnJsc2F0YXJnZXQlM2Rrd2QtNzY2OTEwNjc0NjA0NTIlM2Fsb2MtMTkwJTI2YWRwb3MlM2QlMjZkZXZpY2UlM2RjJTI2bWt0eXBlJTNkJTI2bG9jJTNkNzEzMjYlMjZwb2klM2QlMjZhYmNJZCUzZCUyNmNtcGduJTNkMzI5ODQ4NDk2JTI2c2l0ZWxuayUzZCUyNmFkZ3JvdXBpZCUzZDEyMjcwNTUxMjgwNDM5ODYlMjZuZXR3b3JrJTNkcyUyNm1hdGNodHlwZSUzZGIlMjZtc2Nsa2lkJTNkZjQyZjY3ZTQ3ZWM0MWI3ZDc1MTMzOTA2Y2U2MmE5MzA%26rlid%3Df42f67e47ec41b7d75133906ce62a930&linktype=SideSponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1003&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=www.ebay.com&resultType=sponsored',
      },
      {
        Metadata: {},
        PlacementHint: 'Sidebar',
        Rank: 4,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=SideSponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1004&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=sponsored',
        pid: 2,
        Title: 'Shop Cola Cola on Amazon - Low Prices for Cola Cola',
        Description:
          'Read Customer Reviews & Find Best Sellers. Free 2-Day Shipping w/Amazon Prime.',
        DisplayUrl: 'www.amazon.com/popular/items',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bing.com%2Faclick%3Fld%3De84oJ9PFDH7V175xF0y8fFrzVUCUzJr4jaaSC91iSG5Uffx74zqeqi37UHXb-po-nav8pUKkqQ9yhip7TlZM10RIVDWrtU2gFF1hQLwBRtwJs1OVefmrW7qOLDNClgs40Lik0Z-HS2xESC5KI9iRBMKs_-p2U%26u%3DaHR0cCUzYSUyZiUyZnd3dy5hbWF6b24uY29tJTJmcyUyZiUzZmllJTNkVVRGOCUyNmtleXdvcmRzJTNkY29sYSUyYmNvbGElMjZ0YWclM2RtaDBiLTIwJTI2aW5kZXglM2RhcHMlMjZodmFkaWQlM2Q3Nzg1OTI5MjQ0MDg0MyUyNmh2cW10JTNkZSUyNmh2Ym10JTNkYmUlMjZodmRldiUzZGMlMjZyZWYlM2RwZF9zbF8ydmp2cnNkYnloX2U%26rlid%3D8857ee0e7f7c113d1455b0eccfda4b8f&linktype=SideSponsored&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=1004&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&displayUrl=www.amazon.com%2Fpopular%2Fitems&resultType=sponsored',
      },
    ],
  },
  SponsoredProductAdsResults: { Items: [] },
  ImageResults: {
    Items: [
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: "Coca-Cola: What's next for world's largest beverage ...",
        Format: 'jpeg',
        Size: 99627,
        Width: 1280,
        Height: 720,
        ImageUrl:
          'https://a57.foxnews.com/static.foxbusiness.com/foxbusiness.com/content/uploads/2019/01/0/0/Coca-Cola-iStock.jpg?ve=1&tl=1',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.foxbusiness.com%2Fbusiness-leaders%2Fcoca-cola-whats-next-for-the-worlds-largest-beverage-company&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.foxbusiness.com/business-leaders/coca-cola-whats-next-for-the-worlds-largest-beverage-company',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.HR_uifR4aPFlOt5IL3QurAHaEK&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 266,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Personalized Coca-Cola Bottles | Coke Store',
        Format: 'png',
        Size: 1580787,
        Width: 1900,
        Height: 1900,
        ImageUrl:
          'https://www.cokestore.com/media/social/share-1-my-friends-my-friends-0.1.0-2.png',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.cokestore.com%2Fpersonalized-bottle&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl: 'https://www.cokestore.com/personalized-bottle',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.H2hhf7AOk76xBwD37RHoAQHaHa&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 474,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'brandchannel: Coca-Cola Tacks Aggressively Toward ...',
        Format: 'jpeg',
        Size: 189365,
        Width: 1200,
        Height: 1200,
        ImageUrl:
          'https://www.brandchannel.com/wp-content/uploads/2018/09/Coke-coca-cola-thumbnail.jpg',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.brandchannel.com%2F2018%2F09%2F14%2Fcoca-cola-tacks-aggressively-toward-acquisitions-new-products%2F&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.brandchannel.com/2018/09/14/coca-cola-tacks-aggressively-toward-acquisitions-new-products/',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.tQrub1zAabyvMHOrVRPJNAHaHa&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 474,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Target: Coca-Cola 2 Liter Bottles Just 72¢ Each When You ...',
        Format: 'jpeg',
        Size: 397090,
        Width: 1200,
        Height: 630,
        ImageUrl:
          'https://hip2save.com/wp-content/uploads/2016/12/untitled-53.jpg',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fhip2save.com%2F2016%2F12%2F21%2Ftarget-coca-cola-2-liter-bottles-just-72%25C2%25A2-each-when-you-buy-5-today-only%2F&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://hip2save.com/2016/12/21/target-coca-cola-2-liter-bottles-just-72%C2%A2-each-when-you-buy-5-today-only/',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.J5qK78W83AA6bioKVIBQsAHaD4&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 248,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coca-Cola UK redesigns Zero packaging to look like the ...',
        Format: 'jpeg',
        Size: 113431,
        Width: 1400,
        Height: 950,
        ImageUrl:
          'https://image.cnbcfm.com/api/v1/image/105410531-1534949908271coca-colazerosugarpackagingshot.png?v=1534950021&w=1400&h=950',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.cnbc.com%2F2018%2F08%2F22%2Fcoca-cola-uk-redesigns-zero-packaging-to-look-like-the-original-coke.html&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.cnbc.com/2018/08/22/coca-cola-uk-redesigns-zero-packaging-to-look-like-the-original-coke.html',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.wUkUMO2ZfrKtzd4O4fB-3QHaFB&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 321,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coca Cola 3L | Soft Drinks, Coke',
        Format: 'jpeg',
        Size: 64857,
        Width: 800,
        Height: 800,
        ImageUrl:
          'https://cdn.bmstores.co.uk/images/hpcProductImage/imgFull/304668-Coca-Cola-3LTR-Classic.jpg',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bmstores.co.uk%2Fproducts%2Fcoca-cola-3l-304668&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl: 'https://www.bmstores.co.uk/products/coca-cola-3l-304668',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.CaG0PohfqUoar1dE0bax1AHaHa&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 474,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coca Cola im Glas Flaschen Klassisch Icon 330ml x24 | eBay',
        Format: 'jpeg',
        Size: 24664,
        Width: 600,
        Height: 600,
        ImageUrl: 'https://i.ebayimg.com/images/i/182641245610-0-1/s-l1000.jpg',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.ebay.at%2Fitm%2FCoca-Cola-im-Glas-Flaschen-Klassisch-Icon-330ml-x24-%2F182641245610&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.ebay.at/itm/Coca-Cola-im-Glas-Flaschen-Klassisch-Icon-330ml-x24-/182641245610',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.car1lOh_32lRTly6OTssPAHaHa&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 474,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coca-Cola on the hunt for new global creative strategy ...',
        Format: 'jpeg',
        Size: 724426,
        Width: 1280,
        Height: 3781,
        ImageUrl:
          'https://media-assets-01.thedrum.com/cache/images/thedrum-prod/public-news-tmp-108565-coke--default--1280.jpg',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.thedrum.com%2Fnews%2F2015%2F03%2F24%2Fcoca-cola-hunt-new-global-creative-strategy&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.thedrum.com/news/2015/03/24/coca-cola-hunt-new-global-creative-strategy',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.BIDmWR12Yuvh6JCLt8_EsQHaV4&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 1400,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Cola - Wikipedia',
        Format: 'jpeg',
        Size: 217253,
        Width: 1200,
        Height: 929,
        ImageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Glass_cola.jpg/1200px-Glass_cola.jpg',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FCola&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl: 'https://en.wikipedia.org/wiki/Cola',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.vuLs9R60DJDSJEdrtxYHPAHaFu&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 366,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coca-Cola 3d model',
        Format: 'jpeg',
        Size: 75893,
        Width: 900,
        Height: 900,
        ImageUrl:
          'https://www.modelplusmodel.com/images/detailed/2/mpm_v09_35_02.jpg',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.modelplusmodel.com%2Faccessories%2Ffood%2F935-coca-cola.html&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.modelplusmodel.com/accessories/food/935-coca-cola.html',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.nsDPL4HYOx4vhYEaa-ATRQHaHa&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 474,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coca-Cola plans limited-time comeback for New Coke | 2019 ...',
        Format: 'jpeg',
        Size: 122731,
        Width: 953,
        Height: 635,
        ImageUrl:
          'https://www.foodbusinessnews.net/ext/resources/2019/5/StrangerThingsCoke_Lead.jpg?height=635&t=1558531007&width=1200',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.foodbusinessnews.net%2Farticles%2F13816-coca-cola-plans-limited-time-comeback-for-new-coke&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.foodbusinessnews.net/articles/13816-coca-cola-plans-limited-time-comeback-for-new-coke',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.fwB0_0ClLWVlFDTggf-kvgHaE7&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 315,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coke Vs. Pepsi: We Settled the Cola Debate Once and For ...',
        Format: 'jpeg',
        Size: 77363,
        Width: 800,
        Height: 450,
        ImageUrl:
          'https://www.tasteofhome.com/wp-content/uploads/2018/07/Cola_Group-800x450.jpg',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.tasteofhome.com%2Farticle%2Fcoke-vs-pepsi-cola-taste-test%2F&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.tasteofhome.com/article/coke-vs-pepsi-cola-taste-test/',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.ZHl8iDdAePMf5Di24m0oowHaEK&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 266,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coca-Cola Amatil (CCL) share price rises on SPC sale ...',
        Format: 'jpeg',
        Size: 138301,
        Width: 1200,
        Height: 1862,
        ImageUrl:
          'https://www.marketmatters.com.au/news/wp-content/uploads/2019/06/coke-1200x1862.jpg',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.marketmatters.com.au%2Fnews%2F2019%2F06%2F04%2Fcoca-cola-amatil-ccl-share-price-rises-on-spc-sale%2F&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.marketmatters.com.au/news/2019/06/04/coca-cola-amatil-ccl-share-price-rises-on-spc-sale/',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.zPnaH1sDRkcYrWx0b-XpbgHaLf&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 735,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'COCA-COLA Soft Drink (6 x 2L) - Lowest Prices & Specials ...',
        Format: 'jpeg',
        Size: 90218,
        Width: 1460,
        Height: 1500,
        ImageUrl:
          'https://www.makro.co.za/Images/Products/Large/MIN_176437_SWA.jpg?v=20180904',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.makro.co.za%2Fnon-return-csd-pet%2Fcoca-cola-%2Fbr-soft-drink-%2Fbr-6-x-2l--176437SW&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.makro.co.za/non-return-csd-pet/coca-cola-/br-soft-drink-/br-6-x-2l--176437SW',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.CbQUOhpiQSk617GMIMXnrQHaHm&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 486,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coca-Cola Classic 6x25cl | Cola | Cola & Limonades | Soft ...',
        Format: 'jpeg',
        Size: 56580,
        Width: 880,
        Height: 880,
        ImageUrl:
          'https://www.coopathome.ch/img/produkte/880_880/RGB/3822054_002.jpg?_=1473325453956',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.coopathome.ch%2Fen%2Fsupermarket%2Fdrinks%2Fsoft-drinks%2Fmultipacks-under-1-liter%2Fcoca-cola-classic-6x25cl%2Fp%2F3822054&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.coopathome.ch/en/supermarket/drinks/soft-drinks/multipacks-under-1-liter/coca-cola-classic-6x25cl/p/3822054',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.AFkPgTUTXpAwn9FjWk6RxQHaHa&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 474,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coca Cola in Glass Bottles Classic Icon 330ml x 24 | eBay',
        Format: 'jpeg',
        Size: 43174,
        Width: 322,
        Height: 966,
        ImageUrl: 'https://i.ebayimg.com/images/i/182595470994-0-1/s-l1000.jpg',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.ebay.co.uk%2Fitm%2FCoca-Cola-in-Glass-Bottles-Classic-Icon-330ml-x-24-%2F182595470994&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.ebay.co.uk/itm/Coca-Cola-in-Glass-Bottles-Classic-Icon-330ml-x-24-/182595470994',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.v-jxEUrTOylSeNoR3OehcAAAAA&pid=Api',
        ThumbnailWidth: 322,
        ThumbnailHeight: 966,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Is Coca Cola Stock A Buy In 2018/2019 📈 Investing In Coca ...',
        Format: 'jpeg',
        Size: 125009,
        Width: 1280,
        Height: 720,
        ImageUrl: 'https://i.ytimg.com/vi/PBuFPx_t7cM/maxresdefault.jpg',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DPBuFPx_t7cM&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl: 'https://www.youtube.com/watch?v=PBuFPx_t7cM',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.MnduC9wqNG7LlKGhkKOecAHaEK&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 266,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coca-Cola is looking at dagga-infused drinks',
        Format: 'jpeg',
        Size: 531379,
        Width: 708,
        Height: 1024,
        ImageUrl:
          'https://lh3.googleusercontent.com/j2OTiIISd-hyenl8BPTPNKBrw99ghWSYo8Uzyy1rSEWUJiVDADhPYyEL1K7zt2FAnc5YJY84Go93MdgKvfo-=s1125',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.timeslive.co.za%2Fsunday-times%2Flifestyle%2Ffood%2F2018-09-18-coca-cola-is-looking-at-dagga-infused-drinks%2F&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.timeslive.co.za/sunday-times/lifestyle/food/2018-09-18-coca-cola-is-looking-at-dagga-infused-drinks/',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.EfHJFG7Eio4PBFQJqvWTPAHaKt&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 685,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'B&M Coca Cola Cherry 500ml - 122894 | B&M',
        Format: 'jpeg',
        Size: 48536,
        Width: 800,
        Height: 800,
        ImageUrl:
          'https://cdn.bmstores.co.uk/images/hpcProductImage/imgFull/122894-coca-cola-cherry-500ml.jpg',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.bmstores.co.uk%2Fproducts%2Fcoca-cola-cherry-500ml-122894&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl:
          'https://www.bmstores.co.uk/products/coca-cola-cherry-500ml-122894',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.3w7Z7-KwBx7zudpxU7Y4KAHaHa&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 474,
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coca-Cola 0 - from RedMart',
        Format: 'jpeg',
        Size: 86579,
        Width: 1600,
        Height: 1600,
        ImageUrl:
          'https://s3-ap-southeast-1.amazonaws.com/media.redmart.com/newmedia/1600x/i/m/8888002076498_0067_1495087124774.jpg',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fredmart.com%2Fproduct%2Fcocacola&linktype=Image&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=7&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        DisplayUrl: 'https://redmart.com/product/cocacola',
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OIP.XV_Jbo1YneIH7Mpc84uNMAHaHa&pid=Api',
        ThumbnailWidth: 474,
        ThumbnailHeight: 474,
      },
    ],
    NumResults: 0,
  },
  VideoResults: {
    Items: [
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 11,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        DatePublished: '2020-06-10T22:06:00',
        Description:
          'Good Trouble” star Sherry Cola shares four trailblazers she looks up to who have paved the way for her “to proudly use her voice.”',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fabcnews.go.com%2FGMA%2FCulture%2Fvideo%2Fsherry-cola-honors-lgbtq-icons-shares-validate-bisexuality-71184025&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        Title:
          'Sherry Cola honors LGBTQ icons and shares why we should ‘validate bisexuality’',
        ThumbnailHeight: 90,
        ThumbnailWidth: 160,
        ThumbnailUrl:
          'https://tse3.mm.bing.net/th?id=OVF.y1iPqQw9V0EevQ9OeEoY1w&pid=Api',
        Publisher: 'ABC News',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 11,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        AllowHttpsEmbed: true,
        AllowMobileEmbed: true,
        DatePublished: '2020-06-08T13:06:00',
        Description: 'Coco-Cola Dance | SmileWithAditya',
        Duration: '1:26',
        EmbedHtml:
          '<iframe frameborder="0" width="480" height="270" src="https://www.dailymotion.com/embed/video/x7ucwjh?autoplay=1" allowfullscreen></iframe>',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.dailymotion.com%2Fvideo%2Fx7ucwjh&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        Title: 'Coco Cola Dance | SmileWithAditya',
        ThumbnailHeight: 90,
        ThumbnailWidth: 160,
        ThumbnailUrl:
          'https://tse3.mm.bing.net/th?id=OVF.EOHD6mGdhIXOhqcH%2fimAyg&pid=Api',
        ViewCount: 1,
        Publisher: 'Dailymotion',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 11,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        AllowHttpsEmbed: true,
        AllowMobileEmbed: true,
        DatePublished: '2020-06-09T14:06:00',
        Description:
          'Coca Cola and Mentos or 8 Amazing Experiment. In this video I will show you awesome experiments with Coca Cola, Mentos and Underwater Reactions. Production Music courtesy of Epidemic Sound: https://www.epidemicsound.com/',
        Duration: '10:07',
        EmbedHtml:
          '<iframe width="1280" height="720" src="http://www.youtube.com/embed/LW9DH6XRD78?autoplay=1" frameborder="0" allowfullscreen></iframe>',
        EncodingFormat: 'mp4',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DLW9DH6XRD78&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        MotionThumbnailUrl:
          'https://tse3.mm.bing.net/th?id=OM.7IjfpcmP1DRjsA&pid=Api',
        Title: 'Coca Cola Vs Mentos | 8 Awesome Experiments',
        ThumbnailHeight: 119,
        ThumbnailWidth: 160,
        ThumbnailUrl:
          'https://tse3.mm.bing.net/th?id=OVF.%2bsuQHAsRqSpmr4%2byYIWUEw&pid=Api',
        ViewCount: 60083,
        Publisher: 'YouTube',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 11,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        DatePublished: '2020-06-11T06:06:00',
        Description:
          'A cool experiment shows how Coca-Cola turns into a clear liquid with water purification tablets. The water treatment is used to remove bacteria and to disinfect water so it can be safely consumed, however this interesting experiment shows how it can removed the colour of cola.',
        Duration: '1:55',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.msn.com%2Fen-gb%2Fvideo%2Fviral%2Freaction-of-coca-cola-with-water-purification-drops%2Fvi-BB15lkIe&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        Title: 'Reaction of Coca-Cola with water purification drops',
        ThumbnailHeight: 89,
        ThumbnailWidth: 160,
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OVF.GOBgmzxFX8eq%2bx9a1e6Ztg&pid=Api',
        Publisher: 'msn.com',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 11,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        AllowHttpsEmbed: true,
        AllowMobileEmbed: true,
        DatePublished: '2020-06-10T01:06:00',
        Description:
          'There is something special about cracking open a fizzy Coca-Cola and taking a big sugary sip of that sweet syrupy drink. A Soviet general felt the same way about Coca-Cola, but one problem, Coca-Cola was illegal in Russia because it promoted American ideals. So this general had the bright idea to strike a deal and thus clear Coca-Cola was born ...',
        Duration: '11:00',
        EmbedHtml:
          '<iframe width="1280" height="720" src="http://www.youtube.com/embed/Zxt8uyt2to4?autoplay=1" frameborder="0" allowfullscreen></iframe>',
        EncodingFormat: 'mp4',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DZxt8uyt2to4&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        MotionThumbnailUrl:
          'https://tse3.mm.bing.net/th?id=OM.2-reTXn6xUxFVg&pid=Api',
        Title: 'Why Soviet Russia Invented A Clear Coca Cola?',
        ThumbnailHeight: 119,
        ThumbnailWidth: 160,
        ThumbnailUrl:
          'https://tse3.mm.bing.net/th?id=OVF.hRqoy99hjgGkh4O09SdPtA&pid=Api',
        ViewCount: 166432,
        Publisher: 'YouTube',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 11,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        AllowHttpsEmbed: true,
        AllowMobileEmbed: true,
        DatePublished: '2020-06-09T09:06:00',
        Description:
          'Amazing hunting idea in jungle,Cola, Fanta,vs Sugar&ZeroWidthSpace;Catch Wild Duck & Catfish In Underground-amazing hunting idea in jungle,Very funny hunting process,',
        Duration: '8:11',
        EmbedHtml:
          '<iframe frameborder="0" width="480" height="270" src="https://www.dailymotion.com/embed/video/x7udeyu?autoplay=1" allowfullscreen></iframe>',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.dailymotion.com%2Fvideo%2Fx7udeyu&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        Title: 'Cola, Fanta,vs Sugar​Catch Wild Duck & Catfish In Underground',
        ThumbnailHeight: 90,
        ThumbnailWidth: 160,
        ThumbnailUrl:
          'https://tse2.mm.bing.net/th?id=OVF.xCoU7qjx8XO4tX%2fm5oNPeA&pid=Api',
        Publisher: 'Dailymotion',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 11,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        AllowHttpsEmbed: true,
        AllowMobileEmbed: true,
        DatePublished: '2020-06-11T08:06:00',
        Description:
          "\"Good Trouble” star Sherry Cola shares five trailblazers she looks up to who have paved the way for her “to proudly use her voice.” Subscribe to GMA's YouTube page: https://bit.ly/2Zq0dU5 Visit Good Morning America's homepage: https://www.goodmorningamerica.com/ Follow GMA: Facebook: https://www.facebook.com/GoodMorningAmerica Twitter ...",
        Duration: '5:24',
        EmbedHtml:
          '<iframe width="1280" height="720" src="http://www.youtube.com/embed/gtNta6FnaDs?autoplay=1" frameborder="0" allowfullscreen></iframe>',
        EncodingFormat: 'mp4',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DgtNta6FnaDs&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        MotionThumbnailUrl:
          'https://tse3.mm.bing.net/th?id=OM.lI6Xzc3KtSF8og&pid=Api',
        Title:
          'Sherry Cola honors LGBTQ icons and shares why we should ‘validate bisexuality’ l GMA Digital',
        ThumbnailHeight: 119,
        ThumbnailWidth: 160,
        ThumbnailUrl:
          'https://tse3.mm.bing.net/th?id=OVF.QLrKbxvxGUT8bYo%2bEuIpOg&pid=Api',
        ViewCount: 478,
        Publisher: 'YouTube',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 11,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        AllowHttpsEmbed: true,
        AllowMobileEmbed: true,
        DatePublished: '2020-06-07T07:06:00',
        Description:
          'Watch other experiments: Giant Coca Cola Balloon VS Mentos - https://youtu.be/9jCVTQb26ZE Coca Cola VS Mentos & Sprite VS Mentos - https://youtu.be/FXMm2sF9ZIE Coca Cola VS Mentos & Fanta VS Mentos. Part 1 - https://youtu.be/ZAl6Lj22xoU Coca Cola VS Mentos & Fanta VS Mentos. Part 2 - https://youtu.be/D3E-WWCsnvI Coca Cola VS Mentos & Pepsi VS ...',
        Duration: '10:02',
        EmbedHtml:
          '<iframe width="1280" height="720" src="http://www.youtube.com/embed/JaNtMxvrsYo?autoplay=1" frameborder="0" allowfullscreen></iframe>',
        EncodingFormat: 'mp4',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DJaNtMxvrsYo&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        MotionThumbnailUrl:
          'https://tse4.mm.bing.net/th?id=OM.t2AZhMtF15pfhw&pid=Api',
        Title:
          'Experiment: Giant Volcano with Coca Cola VS Mentos. Volcanic Eruption!',
        ThumbnailHeight: 119,
        ThumbnailWidth: 160,
        ThumbnailUrl:
          'https://tse4.mm.bing.net/th?id=OVF.6SIlAuFh35CvuXMWMLUJjA&pid=Api',
        ViewCount: 134061,
        Publisher: 'YouTube',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 11,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        AllowHttpsEmbed: true,
        AllowMobileEmbed: true,
        DatePublished: '2019-02-12T10:02:00',
        Description:
          'Presenting the video song "Coca Cola" With LYRICS from the upcoming bollywood movie Dinesh Vijan presents "Luka Chuppi". The Movie features Kartik Aaryan, Kriti Sanon along with Pankaj Tripathi, Aparshakti Khurrana and Vinay Pathak. Luka Chuppi releases in cinemas on 1st March 2019. Starcast: Kartik Aaryan, Kriti Sanon, Pankaj Tripathi, Vinay ...',
        Duration: '3:20',
        EmbedHtml:
          '<iframe width="1280" height="720" src="http://www.youtube.com/embed/YMuTloL20O0?autoplay=1" frameborder="0" allowfullscreen></iframe>',
        EncodingFormat: 'mp4',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DYMuTloL20O0&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        MotionThumbnailUrl:
          'https://tse2.mm.bing.net/th?id=OM.pg6do67FchCGBQ_1590204778&pid=Api',
        Title:
          'LYRICAL: COCA COLA | Luka Chuppi | Kartik A, Kriti S | Tanishk B Neha Kakkar Tony Kakkar Young Desi',
        ThumbnailHeight: 120,
        ThumbnailWidth: 160,
        ThumbnailUrl:
          'https://tse2.mm.bing.net/th?id=OVP.EtC94dSdKuRtpzkzm7OydgHgFo&pid=Api',
        ViewCount: 70171863,
        Publisher: 'YouTube',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 11,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        AllowHttpsEmbed: true,
        AllowMobileEmbed: true,
        DatePublished: '2019-02-04T05:02:00',
        Description:
          'Presenting the video song "Coca Cola" from the upcoming bollywood movie Dinesh Vijan presents "Luka Chuppi". The Movie features Kartik Aaryan, Kriti Sanon along with Pankaj Tripathi, Aparshakti Khurrana and Vinay Pathak. Luka Chuppi releases in cinemas on 1st March 2019. Starcast: Kartik Aaryan, Kriti Sanon, Pankaj Tripathi, Vinay Pathak ...',
        Duration: '2:24',
        EmbedHtml:
          '<iframe width="1280" height="720" src="http://www.youtube.com/embed/_cPHiwPqbqo?autoplay=1" frameborder="0" allowfullscreen></iframe>',
        EncodingFormat: 'mp4',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D_cPHiwPqbqo&linktype=Video&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=11&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        MotionThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OM.hSzolAUZ6zpzwA_1589143711&pid=Api',
        Title:
          'Luka Chuppi: COCA COLA Song | Kartik A, Kriti S | Tony Kakkar Tanishk Bagchi Neha Kakkar Young Desi',
        ThumbnailHeight: 120,
        ThumbnailWidth: 160,
        ThumbnailUrl:
          'https://tse1.mm.bing.net/th?id=OVP.ID9Z3T-AntypaTWPIIltqAHgFo&pid=Api',
        ViewCount: 459918633,
        Publisher: 'YouTube',
      },
    ],
  },
  NewsResults: {
    Items: [
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 10,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=News&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=10&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coca-Cola ends MLB sponsorship after 3 seasons',
        Description:
          'Cola Co. has ended its sponsorship of Major League Baseball after three seasons.  “Following a review of all Coca-Cola North America marketing assets at the conclusion of 2019, we made the decision to end our national sponsorship with MLB,',
        DatePublished: '2020-06-11T05:48:00.0000000Z',
        Provider: 'Fox Business',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.foxbusiness.com%2Fsports%2Fcoca-cola-ends-mlb-sponsorship-after-3-seasons&linktype=News&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=10&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        ThumbnailUrl:
          'https://www.bing.com/th?id=ON.8F197D367ADD0FE2B570F629919F4141&pid=News',
        ThumbnailWidth: 700,
        ThumbnailHeight: 393,
        NewsFeedProvider: 'Bing',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 10,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=News&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=10&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title:
          'Coca-Cola Distributor Offers Bitcoin Payment Options for Aussie Vending Machines',
        Description:
          'More than 2,000 vending machines in Australia and New Zealand will let customers purchase Coke products using bitcoin.',
        DatePublished: '2020-06-11T00:18:00.0000000Z',
        Provider: 'YAHOO!',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Ffinance.yahoo.com%2Fnews%2Fcoca-cola-distributor-offers-bitcoin-000000091.html&linktype=News&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=10&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        ThumbnailUrl:
          'https://www.bing.com/th?id=ON.4B75358942859463D1A76B5B0F8370F4&pid=News',
        ThumbnailWidth: 700,
        ThumbnailHeight: 466,
        NewsFeedProvider: 'Bing',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 10,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=News&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=10&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title:
          "Major Georgia companies including Coca-Cola, Delta call for hate crime legislation in wake of Ahmaud Arbery's death",
        Description:
          "Cola, Delta and Home Depot are calling on lawmakers to pass hate crime legislation in the wake of Ahmaud Arbery's death.",
        DatePublished: '2020-06-09T18:33:00.0000000Z',
        Provider: 'Fox News',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.foxnews.com%2Fus%2Fmajor-georgia-companies-including-coca-cola-and-delta-call-for-hate-crime-legislation-in-wake-of-ahmaud-arbery-death&linktype=News&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=10&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        ThumbnailUrl:
          'https://www.bing.com/th?id=ON.E288C6AD5D89ED3CFB85EB0DCFC5F9AA&pid=News',
        ThumbnailWidth: 700,
        ThumbnailHeight: 393,
        NewsFeedProvider: 'Bing',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 10,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=News&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=10&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title:
          'Ex-Dividend Reminder: Coca-Cola, Leggett & Platt and Tootsie Roll Industries',
        Description:
          'Looking at the universe of stocks we cover at Dividend Channel, on 6/12/20, Coca-Cola Co (Symbol: KO), Leggett & Platt, Inc. (Symbol: LEG), and Tootsie Roll Industries Inc (Symbol: TR) will all trade ex-dividend for their respective upcoming dividends.',
        DatePublished: '2020-06-10T15:09:00.0000000Z',
        Provider: 'Nasdaq',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fwww.nasdaq.com%2Farticles%2Fex-dividend-reminder%253A-coca-cola-leggett-platt-and-tootsie-roll-industries-2020-06-10&linktype=News&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=10&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        ThumbnailUrl:
          'https://www.bing.com/th?id=ON.A2EFFC5EB231194AA44B154B880D5682&pid=News',
        ThumbnailWidth: 700,
        ThumbnailHeight: 350,
        NewsFeedProvider: 'Bing',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 10,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=News&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=10&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Title: 'Coca-Cola Amatil Vending Machines Accept Bitcoin via Centrapay',
        Description:
          'Centrapay, the digital asset integrator, has signed agreements with Coca-Cola Amatil (Amatil) in Australia and New Zealand to give thirsty antipodeans the option to use their Sylo Smart Wallet to pay for items across Amatil’s vending network using cryptocurrency.',
        DatePublished: '2020-06-09T00:03:00.0000000Z',
        Provider: 'Associated Press',
        TargetedUrl:
          'https://feed.cf-se.com/v2/click/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=https%3A%2F%2Fapnews.com%2F762ca95191c4441a97f9fb6324701b16&linktype=News&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=10&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&geo=us&url=http%3A%2F%2Fwww.MySite.com&resultType=organic',
        NewsFeedProvider: 'Bing',
      },
    ],
  },
  RelatedSearches: {
    Items: [
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 5,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=RelatedSearch&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=2000&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Text: 'cola label approval',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 6,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=RelatedSearch&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=2000&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Text: 'cola for camp humphreys korea',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 7,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=RelatedSearch&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=2000&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Text: 'coca cola portal',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 8,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=RelatedSearch&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=2000&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Text: 'cola calculator',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 9,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=RelatedSearch&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=2000&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Text: 'colas usa inc',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 10,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=RelatedSearch&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=2000&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Text: 'cola increase for 2019',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 11,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=RelatedSearch&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=2000&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Text: 'social security increase',
      },
      {
        Metadata: {},
        PlacementHint: 'Mainline',
        Rank: 12,
        PixelUrl:
          'https://feed.cf-se.com/v2/pixel/?gd=SY1002309&uid=&sid=&q=cola&searchProvider=2&searchSource=80&searchTagId=ptvl!%3D!tracingTag%253DC8%2526tracingTag%253DN2%2526tracingTag%253Dus-east-1%2526tracingTag%253Dg1!%26!ptnvls!%3D!%257B%257D!%26!ptvls!%3D!%257B%2522C%2522%253A%25228%2522%252C%2522N%2522%253A%25222%2522%257D&original=&linktype=RelatedSearch&referrer=&agent=&page=0&mkt=&c=8&d=&td=&n=2&af=&at=search&AdUnitId=11713237&AdUnitName=CF_CashNsave_desktop_Media&tid=5b335297-b851-4d85-a70a-89dc9c149f71&adPosition=2000&isid=&ab_isSticky=&ab_startDate=&ab_endDate=&ab_per=&nu=&ptv=2&resultType=organic',
        pid: 2,
        Text: 'cost of living for social security 2020',
      },
    ],
  },
  AdditionalInfo: { AlteredQuery: '' },
})
