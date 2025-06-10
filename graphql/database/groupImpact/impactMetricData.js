const data = [
  {
    id: 'nQUobFEFe',
    charityId: 'cb7ab7e4-bda6-4fdf-825a-30db05911705', // Partners in Health
    dollarAmount: 5e6, // $5
    impactTitle:
      'Provide {{count}} home visit{{#if multiple}}s{{/if}} from a community health worker',
    metricTitle: '1 home visit',
    description:
      'Living in the communities in which they work, community health workers are trusted neighbors who know their community best and use their linguistic, cultural, and technical expertise.\n\nThis provides access to care for people who might not otherwise have it.',
    whyValuableDescription:
      'Community health workers provide quality health care to those who might not otherwise have access.',
    active: false,
    impactCountPerMetric: 1,
  },

  {
    id: 'mhwYA7KbK',
    charityId: 'cb7ab7e4-bda6-4fdf-825a-30db05911705', // Partners in Health
    dollarAmount: 60e6, // $60
    impactTitle:
      'Provide prenatal care for {{count}} wom{{#if multiple}}e{{else}}a{{/if}}n',
    metricTitle: 'prenatal care',
    description:
      'Provide prenatal care to one impoverished mother-to-be--and ensure her pregnancy stays safe.',
    whyValuableDescription:
      'This prenatal care helps ensure a safe pregnancy for an impoverished mother-to-be.',
    active: false,
    impactCountPerMetric: 1,
  },
  {
    id: 'CwxR9zA5W',
    charityId: 'cb7ab7e4-bda6-4fdf-825a-30db05911705', // Partners in Health
    dollarAmount: 25e6, // $25
    impactTitle:
      'Provide {{count}} infant care package{{#if multiple}}s{{/if}}',
    metricTitle: '1 newborn baby kit',
    description:
      'Not all mothers arrive at PIH facilities with newborn supplies. Help families return home in dignity by providing an infant care package, which includes: baby hat, socks, diapers, and bath essentials for the first six weeks of life.',
    whyValuableDescription:
      'This kit provides newborn essentials including hats, socks, diapers, and sanitation for the first 6 weeks, helping ensure a healthy start.',
    active: false,
    impactCountPerMetric: 1,
  },
  {
    id: '3wHhDkuRR',
    charityId: 'ea019270-1cda-411f-b41e-90406fbe15ee', // Action Against Hunger
    dollarAmount: 50e6, // $50
    impactTitle:
      'Provide {{count}} child{{#if multiple}}ren{{/if}} with an emergency nutrition course',
    metricTitle: '1 malnutrition treatment',
    description:
      'This lifesaving course of nutrition saves children from debilitating and life-threatening malnutrition.',
    whyValuableDescription:
      'Hunger is predictable, preventable, and treatable. Yet, one in ten people suffer from hunger. This malnutrition treatment saves and improves lives of children around the world.',
    active: false,
    impactCountPerMetric: 1,
  },
  {
    id: 'VqnFnXXML',
    charityId: '76d50b8c-b611-46d9-8d9d-bab962c2cb41', // Point of Pride
    dollarAmount: 20e6, // $20
    impactTitle:
      'Provide {{count}} chest binders to trans youth and adults across the country',
    metricTitle: '5 chest binders',
    description:
      'Not all trans people can afford or safely obtain chest binders which are specially-designed compression garments. These help trans people of all ages feel confident and fight gender dysphoria safely.',
    whyValuableDescription:
      'These specially-designed compression garments help trans people of all ages feel confident and fight gender dysphoria safely.',
    active: false,
    impactCountPerMetric: 5,
  },
  {
    id: 'V9nF1X2ML',
    charityId: '123e4567-e89b-12d3-a456-426655440000', // Ending Poverty
    dollarAmount: 92e6, // $92
    impactTitle:
      'Provide {{count}} month of cash for a family in extreme poverty',
    metricTitle: '1 month of costs for a family',
    description:
      'GiveDirectly provides direct cash relief to those living in extreme poverty. This life-saving money allows families to improve their health, education, and income.',
    whyValuableDescription:
      'GiveDirectly provides direct cash relief to those living in extreme poverty. This life-saving money allows families to improve their health, education, and income.',
    active: false,
    impactCountPerMetric: 1,
  },
  {
    id: 'gGJy2ebUD',
    charityId: 'f3c349d0-61ab-4301-b3dd-d56895dbbd4e', // #TeamSeas
    dollarAmount: 100e6, // $100
    impactTitle:
      'Remove {{count}} water bottles worth of plastic from our oceans',
    metricTitle: '{{count}} water bottles removed',
    description:
      'Our oceans are increasingly filled with pastic and other waste. TeamSeas is working to remove existing plastic as well as divert plastic coming from rivers and streams to ensure a future for our oceans and marine life.',
    whyValuableDescription:
      'Our oceans are increasingly filled with pastic and other waste. TeamSeas is working to remove existing plastic as well as divert plastic coming from rivers and streams to ensure a future for our oceans and marine life.',
    active: false,
    impactCountPerMetric: 5000,
  },
  {
    id: 'kTeL0g_HM',
    charityId: 'f3c349d0-61ab-4301-b3dd-d56895dbbd4e', // #TeamSeas
    dollarAmount: 300e6, // $300
    impactTitle:
      'Remove {{count}} water bottles worth of plastic from our oceans',
    metricTitle: '{{count}} water bottles removed',
    description:
      'Our oceans are increasingly filled with pastic and other waste. TeamSeas is working to remove existing plastic as well as divert plastic coming from rivers and streams to ensure a future for our oceans and marine life.',
    whyValuableDescription:
      'Our oceans are increasingly filled with pastic and other waste. TeamSeas is working to remove existing plastic as well as divert plastic coming from rivers and streams to ensure a future for our oceans and marine life.',
    active: false,
    impactCountPerMetric: 15000,
    timeboxed: true,
  },
  {
    id: 'Te3oC8KIP',
    charityId: '17099402-4e53-4b42-ad0b-6b89492b61cb', // Eden Reforestation
    dollarAmount: 100e6, // $20
    impactTitle:
      "Plant enough trees to offset {{count}} US homes' yearly energy use",
    metricTitle: "25 homes' energy use offset",
    description:
      'Planting trees restores vital ecosystems, removes CO2 from the atmosphere, and helps prevent erosion. Together with our planting partner, Eden Reforestation, we can help reforest important coastal mangrove forests and provide important, fair wage jobs in Madagascar and Indonesia.',
    whyValuableDescription:
      'Planting trees restores vital ecosystems, removes CO2 from the atmosphere, and helps prevent erosion. Together with our planting partner, Eden Reforestation, we can help reforest important coastal mangrove forests and provide important, fair wage jobs in Madagascar and Indonesia.',
    active: false,
    impactCountPerMetric: 25,
  },
  {
    id: 'OyxVM0_Vc',
    charityId: '90bfe202-54a9-4eea-9003-5e91572387dd', // Save The Children
    dollarAmount: 300e6, // $300
    impactTitle:
      'Provide {{count}} refugee families with a weeks worth of vital supplies',
    metricTitle: '3 family survival kits',
    description:
      "Families fleeing the war in Ukraine are in need of vital supplies. Each kit provides a week's worth of supplies for a family of 5",
    whyValuableDescription:
      "Families fleeing the war in Ukraine are in need of vital supplies. Each kit provides a week's worth of supplies for a family of 5",
    active: false,
    impactCountPerMetric: 3,
  },
  {
    id: 'T79t1sGuc',
    charityId: 'ba4c2888-1d89-4c68-a47d-4f15f1445b6a', // Planned Parenthood
    dollarAmount: 244e6, // $244
    impactTitle:
      'Cover the costs of {{count}} reproductive healthcare visits to someone in need',
    metricTitle: '{{count}} healthcare visits',
    description:
      'It can be difficult and expensive to find and afford reproductive healthcare. Through Planned Parenthood, those in need can recieve timely and vital care when and where it is most needed',
    whyValuableDescription:
      'It can be difficult and expensive to find and afford reproductive healthcare. Through Planned Parenthood, those in need can recieve timely and vital care when and where it is most needed',
    active: false,
    impactCountPerMetric: 2,
  },
  {
    id: 'GIDw4XMeW',
    charityId: '6ce5ad8e-7dd4-4de5-ba4f-13868e7d212z', // Greater Good
    dollarAmount: 3715e5, // $371.5
    impactTitle: 'Educate {{count}} pet caretaker{{#if multiple}}s{{/if}}',
    metricTitle: 'Educate {{count}} pet caretaker',
    description:
      "Help educate a pet caretaker on the intricacies of properly caring for felines, ultimately improving cats' lives in shelters and helping them more quickly find permanent homes",
    whyValuableDescription:
      "Help educate a pet caretaker on the intricacies of properly caring for felines, ultimately improving cats' lives in shelters and helping them more quickly find permanent homes",
    active: false,
    impactCountPerMetric: 1,
  },
  {
    id: 'A8bVxmrf5',
    charityId: '6ce5ad8e-7dd4-4de5-ba4f-13868e7d212z', // Greater Good
    dollarAmount: 3715e5, // $371.5
    impactTitle: 'Educate {{count}} pet caretaker{{#if multiple}}s{{/if}}',
    metricTitle: 'Educate {{count}} pet caretaker',
    description:
      "Help educate a pet caretaker on the intricacies of properly caring for felines, ultimately improving cats' lives in shelters and helping them more quickly find permanent homes",
    whyValuableDescription:
      "Help educate a pet caretaker on the intricacies of properly caring for felines, ultimately improving cats' lives in shelters and helping them more quickly find permanent homes",
    active: false,
    impactCountPerMetric: 1,
    timeboxed: true,
  },
  {
    id: 'Z4pLqjWn9',
    charityId: 'd3f7b1e2-4c8a-45e9-b6d2-8f9c1a7e0b3d', // Best Friends Animal Society
    dollarAmount: 20e6, // $20
    impactTitle:
      'Provide care for {{count}} shelter dog{{#if multiple}}s{{/if}}',
    metricTitle: 'Care for {{count}} shelter dog',
    description:
      'Your tabs help provide food, medical care, and shelter for dogs waiting to find their forever homes. Every contribution helps save lives and brings us closer to a no-kill nation.',
    whyValuableDescription:
      'Your tabs help provide food, medical care, and shelter for dogs waiting to find their forever homes. Every contribution helps save lives and brings us closer to a no-kill nation.',
    active: false,
    impactCountPerMetric: 1,
  },
]

export default data
