export default () =>
  Promise.resolve({
    bing: {
      _type: 'SearchResponse',
      instrumentation: {
        _type: 'ResponseInstrumentation',
        pageLoadPingUrl:
          'https://www.bingapis.com/api/ping/pageload?Some=Data&Type=Thing',
        pingUrlBase: 'https://www.bingapis.com/api/ping?Some=Data',
      },
      queryContext: {
        originalQuery: 'johh mayer',
        alteredQuery: 'john mayer',
        alterationDisplayQuery: 'john mayer',
        alterationOverrideQuery: '+johh mayer',
        adultIntent: false,
      },
      ads: {
        value: [
          {
            _type: 'Ads/TextAd',
            id: 'https://www.bingapis.com/api/v7/#Ads.0',
            url: 'https://www.bing.com/fake-ad-click-id-0',
            urlPingSuffix: 'Foo,1234',
            description:
              'Hoof It On Over and Shop High Performance Cow-Puters on Amazon',
            rank: 1,
            position: 'Mainline',
            impressionToken: '1',
            title: 'Cow-puters on A-moo-zon.com - Official Site',
            displayUrl: 'www.example.com/cow',
            isAdult: false,
            phoneNumber: '',
            extensions: [
              {
                _type: 'Ads/SiteLinkExtension',
                impressionToken: '17',
                sitelinks: [
                  {
                    descriptionLine1: 'Get the best view of Seattle.',
                    descriptionLine2: "Don't be left out",
                    text: '#1 Seattle Experience',
                    link: 'https://www.bing.com/fake-ad-click-id-0-sitelink-0',
                    pingUrlSuffix: 'Foo,1234.0',
                    impressionToken: '18',
                  },
                  {
                    descriptionLine1: 'Great rates for corporate events.',
                    descriptionLine2: 'Share the experience with friends.',
                    text: 'Group Rates Available',
                    link: 'https://www.bing.com/fake-ad-click-id-0-sitelink-1',
                    pingUrlSuffix: 'Foo,1234.1',
                    impressionToken: '19',
                  },
                  {
                    descriptionLine1: 'Best experience of my life.',
                    descriptionLine2: 'First rate operation. Best ever.',
                    text: 'Testimonials',
                    link: 'https://www.bing.com/fake-ad-click-id-0-sitelink-2',
                    pingUrlSuffix: 'Foo,1234.2',
                    impressionToken: '20',
                  },
                  {
                    impressionToken: '21',
                  },
                ],
                isCreatedDynamically: false,
              },
            ],
          },
          {
            _type: 'Ads/TextAd',
            id: 'https://www.bingapis.com/api/v7/#Ads.1',
            url: 'https://www.bing.com/fake-ad-click-id-1',
            urlPingSuffix: 'Foo,1234',
            description:
              'This is the fakey-est link you could imagine. Not real at all!',
            rank: 1,
            position: 'Mainline',
            impressionToken: '1',
            title: 'Fakey-fake Search Result - Visit Now for Imaginary Stuff!',
            displayUrl: 'www.example.com/fakey',
            isAdult: false,
            phoneNumber: '',
          },
          {
            _type: 'Ads/TextAd',
            id: 'https://www.bingapis.com/api/v7/#Ads.2',
            url: 'https://www.bing.com/fake-ad-click-id-2',
            urlPingSuffix: 'Foo,1234',
            description:
              'Wow - Unbelievable Deals - Ridiculous Advertising Syntax - Woohoo!',
            rank: 1,
            position: 'Mainline',
            impressionToken: '1',
            title: `Deals You Won't Even Believe, Wowzer`,
            displayUrl: 'www.example.com/Unbelievable',
            isAdult: false,
            phoneNumber: '',
          },
        ],
      },
      webPages: {
        webSearchUrl: 'https://www.bing.com/search?q=johh+mayer',
        totalEstimatedMatches: 14700000,
        value: [
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.0',
            name: 'John Mayer - Official Site',
            url: 'http://johnmayer.com/',
            about: [
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer Trio',
              },
              {
                name: 'John Mayer',
              },
            ],
            isFamilyFriendly: true,
            displayUrl: 'johnmayer.com',
            snippet:
              'Official Website of John Mayer. Newsletter Sign Up. SUBMIT',
            dateLastCrawled: '2019-04-04T04:21:00.0000000Z',
            language: 'en',
            isNavigational: false,
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.1',
            name: 'John Mayer - Wikipedia',
            url: 'https://en.wikipedia.org/wiki/John_Mayer',
            about: [
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
            ],
            isFamilyFriendly: true,
            displayUrl: 'https://en.wikipedia.org/wiki/John_Mayer',
            snippet:
              'John Mayer is a guitar collector and has collaborated with elite guitar companies to design his own instruments. He owns over 200 guitars. In 2003, Martin Guitars gave Mayer his own signature model acoustic guitar called the OM-28 John Mayer. The guitar was limited to a run of only 404, an Atlanta area code.',
            snippetAttribution: {
              license: {
                name: 'CC-BY-SA',
                url: 'http://creativecommons.org/licenses/by-sa/3.0/',
              },
              licenseNotice: 'Text under CC-BY-SA license',
            },
            dateLastCrawled: '2019-04-05T10:03:00.0000000Z',
            richCaption: {
              _type: 'StructuredValue/SectionData',
              sections: [
                {
                  _type: 'StructuredValue/SimpleSection',
                  name: 'Overview',
                  siteName: 'en.wikipedia.org',
                  description:
                    'John Clayton Mayer is an American singer-songwriter, guitarist, and record producer. Born in Bridgeport, Connecticut, Mayer attended Berklee College of Music in Boston, but disenrolled and moved to Atlanta in 1997 with Clay Cook. Together, they formed a short-lived two-man band called Lo-Fi Masters. After their split, Mayer continued to play local clubs, refining his skills and gaining a following. After his appearance at the 2001 South by Southwest Festival, he was signed to Aware Records, and',
                },
                {
                  _type: 'StructuredValue/SimpleSection',
                  name: 'Early life',
                  siteName: 'en.wikipedia.org',
                  description:
                    'Mayer was born on October 16, 1977, in Bridgeport, Connecticut, to Richard and Margaret Mayer. He grew up in nearby Fairfield, the middle child between older brother Carl and younger brother Ben. His father is Jewish, and Mayer has said that he relates to Judaism. As a middle school student, Mayer became close friends with future tennis star James Blake, and they often played Nintendo together after school. He attended the Center for Global Studies at Brien McMahon High School in Norwalk for his',
                },
                {
                  _type: 'StructuredValue/ListSection',
                  name: 'Career',
                  siteName: 'en.wikipedia.org',
                  listData: [
                    {
                      listItems: [
                        {
                          items: [
                            {
                              _type: 'Properties/Link',
                              text: 'Early career (1996–1999)',
                              url:
                                'https://en.wikipedia.org/wiki/John_Mayer#Early_career_(1996%E2%80%931999)',
                            },
                          ],
                        },
                        {
                          items: [
                            {
                              text:
                                'Mayer considered skipping college to pursue his music, but his parents dissuaded him. He enrolled in the Berklee College of Music in 1997 at age 19. At the urging of his college friend Clay Cook, they left Berklee after two semesters and moved to Atlanta. There, they formed a two',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      listItems: [
                        {
                          items: [
                            {
                              _type: 'Properties/Link',
                              text:
                                'Major label and commercial success (2000–2004)',
                              url:
                                'https://en.wikipedia.org/wiki/John_Mayer#Major_label_and_commercial_success_(2000%E2%80%932004)',
                            },
                          ],
                        },
                        {
                          items: [
                            {
                              text:
                                'Mayer and LaBruyere performed throughout Georgia and nearby states. Also, as his career coincided with the then-nascent internet music market, Mayer benefited from an online following. Mayer came to the attention of Gregg Latterman at Aware Records through an acquaintance of Maye',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      listItems: [
                        {
                          items: [
                            {
                              _type: 'Properties/Link',
                              text: 'Change in musical direction (2005–2008)',
                              url:
                                'https://en.wikipedia.org/wiki/John_Mayer#Change_in_musical_direction_(2005%E2%80%932008)',
                            },
                          ],
                        },
                        {
                          items: [
                            {
                              text:
                                'As early as 2002, Chris Willman with Entertainment Weekly said that Mayer was &quot;more historically savvy, and more ambitious than you&#39;d guess from the unforced earnestness of [Room for] Squares&quot;. However, Mayer was largely associated with the Adult Contemporary and singer-songwrite',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      listItems: [
                        {
                          items: [
                            {
                              _type: 'Properties/Link',
                              text: 'Battle Studies (2009)',
                              url:
                                'https://en.wikipedia.org/wiki/John_Mayer#Battle_Studies_(2009)',
                            },
                          ],
                        },
                        {
                          items: [
                            {
                              text:
                                'Australian artist Guy Sebastian invited Mayer to collaborate on three songs from his 2009 album Like It Like That. Mayer also played guitar on the title track of Crosby Loggins&#39; debut LP, Time to Move. On July 7, 2009, Mayer performed an instrumental guitar version of Michael Jac',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      listItems: [
                        {
                          items: [
                            {
                              _type: 'Properties/Link',
                              text: 'Personal troubles and hiatus (2010–2013)',
                              url:
                                'https://en.wikipedia.org/wiki/John_Mayer#Personal_troubles_and_hiatus_(2010%E2%80%932013)',
                            },
                          ],
                        },
                        {
                          items: [
                            {
                              text:
                                'John Mayer Following two revealing and highly controversial magazine interviews in February 2010 with Rolling Stone and Playboy magazines, Mayer withdrew from public life and ceased giving interviews. While still on tour for Battle Studies, he began work in earnest on his fifth s',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      listItems: [
                        {
                          items: [
                            {
                              _type: 'Properties/Link',
                              text:
                                'Paradise Valley, Dead &amp; Company, and The Search for Everything (2013–present)',
                              url:
                                'https://en.wikipedia.org/wiki/John_Mayer#Paradise_Valley,_Dead_&_Company,_and_The_Search_for_Everything_(2013%E2%80%93present)',
                            },
                          ],
                        },
                        {
                          items: [
                            {
                              text:
                                'In June 2013, Mayer announced that he was finishing work on his sixth album, Paradise Valley. Produced by Don Was, the album features &quot;low-key folk-rock tunes&quot;. He collaborated with Frank Ocean on the song &quot;Wildfire Pt. 2&quot;, and with Katy Perry on &quot;Who You Love&quot;. The latter song w',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  _type: 'StructuredValue/SimpleSection',
                  name: 'Touring',
                  siteName: 'en.wikipedia.org',
                  description:
                    'Mayer began touring as a solo artist in 2001. While his early records were largely acoustic, early reviewers noted his unexpected electric &quot;guitar heroics&quot; during live performances. Mayer has toured North America, Europe and Australia with many musical groups, including Maroon 5,Counting Crows, Ben Folds, the Wallflowers, Sheryl Crow, Colbie Caillat and Train. In 2010, Mayer and Keith Urban performed at a CMT Crossroads concert a medley of their songs and a rendition of George Michael&#39;s single,',
                },
                {
                  _type: 'StructuredValue/ListSection',
                  name: 'Other ventures',
                  siteName: 'en.wikipedia.org',
                  listData: [
                    {
                      listItems: [
                        {
                          items: [
                            {
                              _type: 'Properties/Link',
                              text: 'Dead &amp; Company',
                              url:
                                'https://en.wikipedia.org/wiki/John_Mayer#Dead_&_Company',
                            },
                          ],
                        },
                        {
                          items: [
                            {
                              text:
                                'Since 2015, Mayer has been touring with Bob Weir, Bill Kreutzmann and Mickey Hart of the Grateful Dead. Founding bassist Phil Lesh has notably declined to participate in the project, although he has performed with Mayer on a few occasions since Dead &amp; Company began. The role of b',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      listItems: [
                        {
                          items: [
                            {
                              _type: 'Properties/Link',
                              text: 'Author',
                              url:
                                'https://en.wikipedia.org/wiki/John_Mayer#Author',
                            },
                          ],
                        },
                        {
                          items: [
                            {
                              text:
                                'With the June 2004 issue of Esquire, Mayer began a column called &quot;Music Lessons with John Mayer&quot;. Each article featured a lesson and his views on various topics, both of personal and popular interest. In the August 2005 issue, he invited readers to create music for orphaned lyric',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      listItems: [
                        {
                          items: [
                            {
                              _type: 'Properties/Link',
                              text: 'Current Mood',
                              url:
                                'https://en.wikipedia.org/wiki/John_Mayer#Current_Mood',
                            },
                          ],
                        },
                        {
                          items: [
                            {
                              text:
                                'During an appearance on the Jimmy Kimmel Live show in September 2018, Mayer showed a trailer for his new Instagram Live show. The show Current Mood debuted on his IGTV account on Sunday evening on September 30. Episodes have continued to air on that schedule on a weekly basis. Gu',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      listItems: [
                        {
                          items: [
                            {
                              _type: 'Properties/Link',
                              text: 'Appearances in the media',
                              url:
                                'https://en.wikipedia.org/wiki/John_Mayer#Appearances_in_the_media',
                            },
                          ],
                        },
                        {
                          items: [
                            {
                              text:
                                'In 2004, Mayer hosted a one-shot, half-hour comedy special on VH1 titled John Mayer Has a TV Show, with antics including wearing a bear suit while anonymously teasing concertgoers in the parking lot outside one of his concerts. January 2005, left to right: David Ryan Harris, John',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  _type: 'StructuredValue/SimpleSection',
                  name: 'Instruments and equipment',
                  siteName: 'en.wikipedia.org',
                  description:
                    'John Mayer is a guitar collector and has collaborated with elite guitar companies to design his own instruments. He owns over 200 guitars. In 2003, Martin Guitars gave Mayer his own signature model acoustic guitar called the OM-28 John Mayer. The guitar was limited to a run of only 404, an Atlanta area code. This model was followed by the release of two Fender signature Stratocaster electric guitars, beginning in 2005. A third Stratocaster, finished in charcoal frost metallic paint with a racing',
                },
              ],
            },
            language: 'en',
            isNavigational: false,
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.2',
            name:
              'John Mayer - Free Fallin&#39; (Live at the Nokia Theatre ...',
            url: 'https://www.youtube.com/watch?v=20Ov0cDPZy8',
            about: [
              {
                name: 'Free Fallin&#39;',
              },
              {
                name: 'Free Fallin&#39;',
              },
            ],
            isFamilyFriendly: true,
            displayUrl: 'https://www.youtube.com/watch?v=20Ov0cDPZy8',
            snippet:
              'John Mayer&#39;s official live video for &#39;Free Fallin&#39; (Live At the Nokia Theatre)&#39;. Click to listen to John Mayer on Spotify: http://smarturl.it/JMayerSpotify?IQid... As ...',
            dateLastCrawled: '2019-04-03T01:42:00.0000000Z',
            language: 'en',
            isNavigational: false,
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.3',
            name: 'John Mayer (@JohnMayer) | Twitter',
            url: 'https://twitter.com/JohnMayer',
            about: [
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
            ],
            isFamilyFriendly: true,
            displayUrl: 'https://twitter.com/JohnMayer',
            snippet:
              'Big thanks to @halsey for joining me on this week’s episode of Current Mood. There’s a lot of joy in making this little show, and it’s beginning to reveal itself as something very special. See ya next week.',
            dateLastCrawled: '2019-01-09T16:01:00.0000000Z',
            language: 'en',
            isNavigational: false,
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.4',
            name: 'Gravity by John Mayer - YouTube',
            url: 'https://www.youtube.com/watch?v=7VBex8zbDRs',
            about: [
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
            ],
            isFamilyFriendly: true,
            displayUrl: 'https://www.youtube.com/watch?v=7VBex8zbDRs',
            snippet:
              'John Mayer Licensed to YouTube by SME (on behalf of Columbia); CMRRA, ARESA, Reach Music Publishing, LatinAutor, Global Music Rights LLC, UBEM, LatinAutor - PeerMusic, and 20 Music Rights Societies',
            dateLastCrawled: '2019-04-05T04:02:00.0000000Z',
            language: 'en',
            isNavigational: false,
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.5',
            name: 'John Mayer discography - Wikipedia',
            url: 'https://en.wikipedia.org/wiki/John_Mayer_discography',
            about: [
              {
                name: 'John Mayer discography',
              },
            ],
            isFamilyFriendly: true,
            displayUrl: 'https://en.wikipedia.org/wiki/John_Mayer_discography',
            snippet:
              'The discography of American singer-songwriter and guitarist John Mayer consists of seven studio albums, seven live albums, three compilation albums, two video albums, four extended plays, twenty-four singles and seventeen music videos.',
            snippetAttribution: {
              license: {
                name: 'CC-BY-SA',
                url: 'http://creativecommons.org/licenses/by-sa/3.0/',
              },
              licenseNotice: 'Text under CC-BY-SA license',
            },
            dateLastCrawled: '2019-04-05T16:25:00.0000000Z',
            language: 'en',
            isNavigational: false,
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.6',
            name: 'John Mayer - Home | Facebook',
            url: 'https://www.facebook.com/johnmayer',
            about: [
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
            ],
            isFamilyFriendly: true,
            displayUrl: 'https://www.facebook.com/johnmayer',
            snippet:
              'Facebook is showing information to help you better understand the purpose of a Page. See actions taken by the people who manage and post content.',
            dateLastCrawled: '2019-04-04T20:29:00.0000000Z',
            language: 'en',
            isNavigational: false,
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.7',
            name: 'John Mayer - IMDb',
            url: 'https://www.imdb.com/name/nm1243604/',
            about: [
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
            ],
            isFamilyFriendly: true,
            displayUrl: 'https://www.imdb.com/name/nm1243604',
            snippet:
              'John Mayer was born on October 16, 1977 in Bridgeport, Connecticut, USA as John Clayton Mayer. See full bio »',
            dateLastCrawled: '2019-04-01T00:16:00.0000000Z',
            language: 'en',
            isNavigational: false,
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.8',
            name: 'John Mayer | Biography, Albums, Streaming Links | AllMusic',
            url: 'https://www.allmusic.com/artist/john-mayer-mn0000239827',
            about: [
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer discography',
              },
            ],
            isFamilyFriendly: true,
            displayUrl:
              'https://www.allmusic.com/artist/john-mayer-mn0000239827',
            snippet:
              'John Mayer Biography by Andrew Leahey A talented guitarist with a plaintive vocal style, Mayer updated the confessional singer/songwriter style for the new millennium.',
            dateLastCrawled: '2019-03-30T02:59:00.0000000Z',
            language: 'en',
            isNavigational: false,
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.9',
            name: 'John Mayer 💎 (@johnmayer) • Instagram photos and videos',
            url: 'https://www.instagram.com/johnmayer/',
            about: [
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
            ],
            isFamilyFriendly: true,
            displayUrl: 'https://www.instagram.com/johnmayer',
            snippet:
              '4.1m Followers, 1,301 Following, 1,340 Posts - See Instagram photos and videos from John Mayer 💎 (@johnmayer)',
            dateLastCrawled: '2019-04-02T12:53:00.0000000Z',
            language: 'en',
            isNavigational: false,
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.10',
            name: 'John Mayer music, videos, stats, and photos | Last.fm',
            url: 'https://www.last.fm/music/John+Mayer',
            about: [
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
            ],
            isFamilyFriendly: true,
            displayUrl: 'https://www.last.fm/music/John+Mayer',
            snippet:
              '1) John Clayton Mayer was born October 16, 1977, in Fairfield, Connecticut, USA, and started playing guitar at 13 after being inspired by a Stevie Ray Vaughan tape his neighbor gave him. In 1998 he moved to Atlanta, Georgia where he refined his skills and gained a…',
            dateLastCrawled: '2019-04-05T03:09:00.0000000Z',
            language: 'en',
            isNavigational: false,
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.11',
            name: 'John Mayer on Amazon Music',
            url: 'https://www.amazon.com/John-Mayer/e/B000AQW0EI',
            about: [
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
            ],
            isFamilyFriendly: true,
            displayUrl: 'https://www.amazon.com/John-Mayer/e/B000AQW0EI',
            snippet:
              'Check out John Mayer on Amazon Music. Stream ad-free or purchase CD&#39;s and MP3s now on Amazon.',
            dateLastCrawled: '2019-04-06T03:19:00.0000000Z',
            language: 'en',
            isNavigational: false,
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.12',
            name:
              'John Mayer Tickets | John Mayer Concert Tickets &amp; Tour ...',
            url:
              'https://www.ticketmaster.com/John-Mayer-tickets/artist/770494',
            about: [
              {
                name: 'John Mayer',
              },
              {
                name: 'John Mayer',
              },
            ],
            isFamilyFriendly: true,
            displayUrl:
              'https://www.ticketmaster.com/John-Mayer-tickets/artist/770494',
            snippet:
              'John Mayer is perhaps the best guitarist on the planet, and a brilliant composer and lyricist - and he’s taking good care of himself and that incredible voice. He’s still a bit young for timeless legend status, but that’s his trajectory.',
            dateLastCrawled: '2019-04-05T22:55:00.0000000Z',
            language: 'en',
            isNavigational: false,
          },
        ],
      },
      entities: {
        value: [
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#Entities.0',
            contractualRules: [
              {
                _type: 'ContractualRules/LicenseAttribution',
                targetPropertyName: 'description',
                mustBeCloseToContent: true,
                license: {
                  name: 'CC-BY-SA',
                  url: 'http://creativecommons.org/licenses/by-sa/3.0/',
                },
                licenseNotice: 'Text under CC-BY-SA license',
              },
              {
                _type: 'ContractualRules/LinkAttribution',
                targetPropertyName: 'description',
                mustBeCloseToContent: true,
                text: 'Wikipedia',
                url: 'http://en.wikipedia.org/wiki/John_Mayer',
              },
              {
                _type: 'ContractualRules/MediaAttribution',
                targetPropertyName: 'image',
                mustBeCloseToContent: true,
                url: 'http://en.wikipedia.org/wiki/John_Mayer',
              },
            ],
            webSearchUrl:
              'https://www.bing.com/entityexplore?q=John+Mayer&filters=sid:%22387e0301-ffdd-71af-03bb-b5f0e54e604f%22&elv=AXXfrEiqqD9r3GuelwApulpYNClI0EwnBNRq1lHqMyZ5bgiuxF4reBKVdN!g!ui7fTnzy7ei*3TQv7RUggLboCZ!4XdKgLpmnb4Vz6TETycR',
            name: 'John Mayer',
            url: 'http://www.johnmayer.com/',
            image: {
              name:
                'I&#39;m not deluded enough to think that everyone who knows my name is a listener. You know, I hope that part of that interest - part of that public interest - has to do with me still making records that people like.',
              thumbnailUrl:
                'https://www.bing.com/th?id=AMMS_e998f9fb286f0e0b560e256b7c35c2ff&w=110&h=110&c=12&rs=1&qlt=80&cdv=1&pid=16.2',
              provider: [
                {
                  _type: 'Organization',
                  url: 'http://en.wikipedia.org/wiki/John_Mayer',
                },
              ],
              hostPageUrl:
                'http://cps-static.rovicorp.com/2/Open/Getty/John%20Mayer/85647503.jpg',
              width: 110,
              height: 110,
              sourceWidth: 474,
              sourceHeight: 685,
            },
            description:
              'John Clayton Mayer is an American singer-songwriter, guitarist, and record producer. Born in Bridgeport, Connecticut, Mayer attended Berklee College of Music in Boston, but disenrolled and moved to Atlanta in 1997 with Clay Cook. Together, they formed a short-lived two-man band called Lo-Fi Masters. After their split, Mayer continued to play local clubs, refining his skills and gaining a following. After his appearance at the 2001 South by Southwest Festival, he was signed to Aware Records, and then Columbia Records, which released his first EP, Inside Wants Out. His following two full-length albums—Room for Squares and Heavier Things—did well commercially, achieving multi-platinum status. In 2003, he won the Grammy Award for Best Male Pop Vocal Performance for the single &quot;Your Body Is a Wonderland&quot;.',
            entityPresentationInfo: {
              entityScenario: 'DominantEntity',
              entityTypeHints: ['Artist'],
              entityTypeDisplayHint: 'American Singer-Songwriter',
            },
            bingId: '387e0301-ffdd-71af-03bb-b5f0e54e604f',
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#Entities.1',
            webSearchUrl:
              'https://www.bing.com/entityexplore?q=Free+Fallin%27&filters=sid:%22c182a429-9ccd-5635-8567-749cdfe081c1%22&elv=AXXfrEiqqD9r3GuelwApulpYNClI0EwnBNRq1lHqMyZ5bgiuxF4reBKVdN!g!ui7fTnzy7ei*3TQv7RUggLboCZ!4XdKgLpmnb4Vz6TETycR',
            name: 'Free Fallin&#39;',
            url:
              'http://www.lyrics007.com/Tom%20Petty%20Lyrics/Free%20Fallin%20Lyrics.html',
            image: {
              name: 'Free Fallin&#39;',
              thumbnailUrl:
                'https://www.bing.com/th?id=AMMS_99fc185bf82e02f889079865d14301b7&w=50&h=50&c=7&rs=1&qlt=80&cdv=1&pid=16.1',
              hostPageUrl:
                'https://is3-ssl.mzstatic.com/image/thumb/Music128/v4/12/d9/2e/12d92e91-a51b-18fe-f75c-a984a5bc8c44/00602577036248.rgb.jpg/170x170bb.jpg',
              width: 75,
              height: 75,
              sourceWidth: 170,
              sourceHeight: 170,
            },
            entityPresentationInfo: {
              entityScenario: 'DisambiguationItem',
              entityTypeHints: ['MusicRecording'],
              entityTypeDisplayHint: 'Song',
            },
            bingId: 'c182a429-9ccd-5635-8567-749cdfe081c1',
          },
          {
            id: 'https://api.cognitive.microsoft.com/api/v7/#Entities.2',
            contractualRules: [
              {
                _type: 'ContractualRules/LicenseAttribution',
                targetPropertyName: 'description',
                mustBeCloseToContent: true,
                license: {
                  name: 'CC-BY-SA',
                  url: 'http://creativecommons.org/licenses/by-sa/3.0/',
                },
                licenseNotice: 'Text under CC-BY-SA license',
              },
              {
                _type: 'ContractualRules/LinkAttribution',
                targetPropertyName: 'description',
                mustBeCloseToContent: true,
                text: 'Wikipedia',
                url: 'http://en.wikipedia.org/wiki/John_Mayer_(composer)',
              },
              {
                _type: 'ContractualRules/MediaAttribution',
                targetPropertyName: 'image',
                mustBeCloseToContent: true,
                url: 'http://en.wikipedia.org/wiki/John_Mayer_(composer)',
              },
            ],
            webSearchUrl:
              'https://www.bing.com/entityexplore?q=John+Mayer&filters=sid:%228568d547-772c-b4c2-d0e6-e84c3af52f88%22&elv=AXXfrEiqqD9r3GuelwApulpYNClI0EwnBNRq1lHqMyZ5bgiuxF4reBKVdN!g!ui7fTnzy7ei*3TQv7RUggLboCZ!4XdKgLpmnb4Vz6TETycR',
            name: 'John Mayer',
            url: 'http://www.twitter.com/JohnMayer',
            image: {
              name: 'John Mayer',
              thumbnailUrl:
                'https://www.bing.com/th?id=AMMS_d68d45b5cd608ed850686e54cc09e4f0&w=50&h=50&c=12&rs=1&qlt=80&cdv=1&pid=16.2',
              provider: [
                {
                  _type: 'Organization',
                  url: 'http://en.wikipedia.org/wiki/John_Mayer_(composer)',
                },
              ],
              hostPageUrl:
                'http://upload.wikimedia.org/wikipedia/en/e/ed/John_Mayer_indian_composer.jpg',
              width: 75,
              height: 75,
              sourceWidth: 275,
              sourceHeight: 275,
            },
            description:
              'John Mayer was an Indian composer known primarily for his fusions of jazz with Indian music in the British-based group Indo-Jazz Fusions with the Jamaican-born saxophonist Joe Harriott..',
            entityPresentationInfo: {
              entityScenario: 'DisambiguationItem',
              entityTypeHints: ['Artist'],
              entityTypeDisplayHint: 'Composer',
            },
            bingId: '8568d547-772c-b4c2-d0e6-e84c3af52f88',
          },
        ],
      },
      images: {
        id: 'https://api.cognitive.microsoft.com/api/v7/#Images',
        readLink:
          'https://api.cognitive.microsoft.com/api/v7/images/search?q=john+mayer&qpvt=johh+mayer',
        webSearchUrl:
          'https://www.bing.com/images/search?q=john+mayer&qpvt=johh+mayer',
        isFamilyFriendly: true,
        value: [
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=E45EFE04C2962364E696D992E44EC35116029182&FORM=IARRTH',
            name:
              'John Mayer isn&#39;t a shoo-in at Lower East Side lounge - NY Daily News',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.c7jkl-TuMYIVt2ytN-GQ1QHaLG&pid=Api',
            datePublished: '2014-09-30T12:00:00.0000000Z',
            contentUrl:
              'http://assets.nydailynews.com/polopoly_fs/1.1957448.1412043573!/img/httpImage/image.jpg_gen/derivatives/article_750/webconfitems30f-1-web.jpg',
            hostPageUrl:
              'http://www.nydailynews.com/entertainment/gossip/confidential/john-mayer-isn-shoo-in-east-side-lounge-article-1.1957449',
            contentSize: '102152 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'http://www.nydailynews.com/entertainment/gossip/confidential/john-mayer-isn-shoo-in-east-side-lounge-article-1.1957449',
            width: 750,
            height: 1124,
            thumbnail: {
              width: 474,
              height: 710,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=B1F4BE28EA268812687771D697687B6F86A5C13C&FORM=IARRTH',
            name: 'John Mayer - Wikipedia',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.FDECB9D1XlLUccNX9GtsKQAAAA&pid=Api',
            datePublished: '2018-04-21T22:35:00.0000000Z',
            contentUrl:
              'https://upload.wikimedia.org/wikipedia/commons/4/4d/John_Mayer_live_in_2007_01.png',
            hostPageUrl: 'https://en.wikipedia.org/wiki/John_Mayer',
            contentSize: '368335 B',
            encodingFormat: 'png',
            hostPageDisplayUrl: 'https://en.wikipedia.org/wiki/John_Mayer',
            width: 361,
            height: 513,
            thumbnail: {
              width: 361,
              height: 513,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=EB863D6B99245C65BD36E1A040225D7FC461806D&FORM=IARRTH',
            name: 'John Mayer | POPSUGAR Celebrity',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.I9QRl8L9gTL2b5RhjISirQHaJ3&pid=Api',
            datePublished: '2016-04-07T23:34:00.0000000Z',
            contentUrl:
              'http://media3.popsugar-assets.com/files/2015/10/23/926/n/1922398/14504bcbf6da3c6d_GettyImages-463158034.jpg',
            hostPageUrl: 'http://www.popsugar.com/John-Mayer',
            contentSize: '2969055 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl: 'http://www.popsugar.com/John-Mayer',
            width: 2253,
            height: 3000,
            thumbnail: {
              width: 474,
              height: 631,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=C221997DDB74839F184AF87B31020A7A2EB99B54&FORM=IARRTH',
            name:
              'The Dirty Mind and Lonely Heart of John Mayer | Rolling Stone',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.4o5b8zQVH9AtPIUWJ4yWmAHaEK&pid=Api',
            datePublished: '2012-06-06T12:00:00.0000000Z',
            contentUrl:
              'http://assets.rollingstone.com/assets/2012/article/the-dirty-mind-and-lonely-heart-of-john-mayer-20120606/194222/large_rect/1430418889/1401x788-140650247.jpg',
            hostPageUrl:
              'http://www.rollingstone.com/music/news/the-dirty-mind-and-lonely-heart-of-john-mayer-20120606',
            contentSize: '145667 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'http://www.rollingstone.com/music/news/the-dirty-mind-and-lonely-heart-of-john-mayer-20120606',
            width: 1401,
            height: 788,
            thumbnail: {
              width: 474,
              height: 266,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=D17E195DBAF0A4FA248DBA6D710BE23C9C5AC604&FORM=IARRTH',
            name: 'Why was John Mayer in the band at the 2016 Emmy Awards',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.ukutxMcyMUfOulQvu_otjwHaLH&pid=Api',
            datePublished: '2017-05-06T12:46:00.0000000Z',
            contentUrl:
              'http://photos.laineygossip.com/articles/mayer-emmys-19sep16-01.jpg',
            hostPageUrl:
              'http://www.laineygossip.com/Why-was-John-Mayer-in-the-band-at-the-2016-Emmy-Awards/44959',
            contentSize: '180623 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'http://www.laineygossip.com/Why-was-John-Mayer-in-the-band-at-the-2016-Emmy-Awards/44959',
            width: 799,
            height: 1200,
            thumbnail: {
              width: 474,
              height: 711,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=2BB6598767E30E46F2579386E18DB3107791F883&FORM=IARRTH',
            name:
              'John Mayer &amp; More Male Celebs Share Their Skin-Care Favorites | E! News UK',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.40N89BdgscuUrXPmfKt-hQHaJQ&pid=Api',
            datePublished: '2018-11-02T12:03:00.0000000Z',
            contentUrl:
              'https://akns-images.eonline.com/eol_images/Entire_Site/201826/rs_1080x1350-180306105938-1080x1350-John-Mayer-Beauty-products.jl.030618.jpg?fit=inside%7C900:auto&output-quality=90',
            hostPageUrl:
              'https://www.eonline.com/uk/news/918829/john-mayer-more-male-celebs-share-their-skin-care-favorites',
            contentSize: '112552 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'https://www.eonline.com/uk/news/918829/john-mayer-more-male-celebs-share-their-skin-care-favorites',
            width: 1080,
            height: 1350,
            thumbnail: {
              width: 474,
              height: 592,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=00B90F91D16AE3EE006EB718FCB4EF1EA3CC89EE&FORM=IARRTH',
            name:
              'John Mayer, nearing 40, seeks a comeback | The Daily Gazette',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.GSSiYmKkLeakhmhe-bkouwHaEy&pid=Api',
            datePublished: '2017-03-30T00:24:00.0000000Z',
            contentUrl:
              'https://dailygazette.com/sites/default/files/styles/article_image/public/4t%20mayer%20cov.jpg?itok=Utl6R9LA',
            hostPageUrl:
              'https://dailygazette.com/article/2017/03/29/john-mayer-nearing-40-seeks-a-comeback',
            contentSize: '207089 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'https://dailygazette.com/article/2017/03/29/john-mayer-nearing-40-seeks-a-comeback',
            width: 1830,
            height: 1184,
            thumbnail: {
              width: 474,
              height: 306,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=E1B06B5B2E6584E4529C36099828B6AF56F14CED&FORM=IARRTH',
            name:
              'John Mayer Personalizes Yeezy Boots, Supreme x LV Shirt | PEOPLE.com',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.6IQEDGQ8-TLjEZKVVZqohQHaI0&pid=Api',
            datePublished: '2018-06-15T01:41:00.0000000Z',
            contentUrl:
              'https://peopledotcom.files.wordpress.com/2017/08/john-mayer2.jpg',
            hostPageUrl:
              'http://people.com/style/john-mayer-streetwear-yeezys-supreme-louis-vuitton-shirt/',
            contentSize: '3349715 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'http://people.com/style/john-mayer-streetwear-yeezys-supreme-louis-vuitton-shirt/',
            width: 1679,
            height: 2000,
            thumbnail: {
              width: 474,
              height: 564,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=21F7D9E686C9C1A8C114B899554DEC99ED68B578&FORM=IARRTH',
            name:
              'John Mayer Net Worth 2017-2016, Bio, Wiki - RENEWED! - Celebrity Net Worth',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.B91uhP8fQRmKpPtWsIfdcgHaJ5&pid=Api',
            datePublished: '2017-03-21T02:44:00.0000000Z',
            contentUrl:
              'http://net-worths.org/wp-content/uploads/2013/09/John-Mayer-1.jpg',
            hostPageUrl: 'http://net-worths.org/john-mayer-net-worth/',
            contentSize: '33052 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl: 'http://net-worths.org/john-mayer-net-worth/',
            width: 1050,
            height: 1404,
            thumbnail: {
              width: 474,
              height: 633,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=729108DF5572EDFE4CE29BA64E32615961FDE02E&FORM=IARRTH',
            name:
              'John Mayer on Katy Perry, Learning From the Dead, Embracing Pot | indieBrew.Net',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.ywLP0M3rP9W_bCFTcyuHDAHaD4&pid=Api',
            datePublished: '2017-06-28T20:13:00.0000000Z',
            contentUrl:
              'http://img.wennermedia.com/social/rs-john-mayer-8764aea4-9a74-44ed-ac5e-8c6ad3d97205.jpg',
            hostPageUrl:
              'http://indiebrew.net/brewpress/2017/06/john-mayer-on-katy-perry-learning-from-the-dead-embracing-pot/',
            contentSize: '65892 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'http://indiebrew.net/brewpress/2017/06/john-mayer-on-katy-perry-learning-from-the-dead-embracing-pot/',
            width: 1200,
            height: 630,
            thumbnail: {
              width: 474,
              height: 248,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=83E344DE94F3978036E746384D55EC91EB07BD54&FORM=IARRTH',
            name: 'John Mayer - Songwriter, Guitarist, Singer - Biography',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.0qV0wDHXmLfQIvsTvNmO5gHaHa&pid=Api',
            datePublished: '2018-03-09T03:23:00.0000000Z',
            contentUrl:
              'https://www.biography.com/.image/t_share/MTE5NTU2MzE2MTAyODIxMzg3/john-mayer-507677-1-402.jpg',
            hostPageUrl: 'http://www.biography.com/people/john-mayer-507677',
            contentSize: '162953 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'http://www.biography.com/people/john-mayer-507677',
            width: 1200,
            height: 1200,
            thumbnail: {
              width: 474,
              height: 474,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=D6C1B11B1E14CAFA8AFFB26983AC3554FEDB2C17&FORM=IARRTH',
            name:
              'John Mayer’s New Music Was Inspired By Split From Katy Perry | Idolator',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.UoPuG9nUm4g5SoN-VNmgMwHaE7&pid=Api',
            datePublished: '2017-02-25T17:32:00.0000000Z',
            contentUrl:
              'http://static.idolator.com/uploads/2017/02/john-mayer-1488041407.jpg',
            hostPageUrl:
              'http://www.idolator.com/7658109/john-mayer-katy-perry-inspiration-the-search-for-everything',
            contentSize: '68825 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'http://www.idolator.com/7658109/john-mayer-katy-perry-inspiration-the-search-for-everything',
            width: 620,
            height: 413,
            thumbnail: {
              width: 474,
              height: 315,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=0A791A71A9E9E711F252FE299F7961F825660FDA&FORM=IARRTH',
            name:
              'John Mayer Bringing His “Search For Everything” Tour To Riverbend Music Center on August 26 ...',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.7bd1FaSkqUl22eNQgurnrwHaJ3&pid=Api',
            datePublished: '2017-03-03T07:12:00.0000000Z',
            contentUrl:
              'http://www.cincygroove.com/wp-content/uploads/2017/03/johnmayer2017.jpg',
            hostPageUrl: 'http://www.cincygroove.com/?p=71338',
            contentSize: '43168 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl: 'http://www.cincygroove.com/?p=71338',
            width: 730,
            height: 973,
            thumbnail: {
              width: 474,
              height: 631,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=3AA9E79F6EDAF86853CAEA814AC5323361930344&FORM=IARRTH',
            name: 'John Mayer Is a Wonderland | The New Yorker',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.xdeVl6I-SDFk4fDx9ny44gHaJQ&pid=Api',
            datePublished: '2019-03-15T19:55:00.0000000Z',
            contentUrl:
              'https://media.newyorker.com/photos/59097fa9c14b3c606c109c9e/master/w_727,c_limit/Petrusich-John-Mayer.jpg',
            hostPageUrl:
              'https://www.newyorker.com/culture/culture-desk/john-mayer-is-a-wonderland',
            contentSize: '95040 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'https://www.newyorker.com/culture/culture-desk/john-mayer-is-a-wonderland',
            width: 727,
            height: 909,
            thumbnail: {
              width: 474,
              height: 592,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=6ED2B1DB36DCDD7D7A4F6D6FCFD8FA38B718CF00&FORM=IARRTH',
            name:
              'John Mayer&#39;s CBS Sunday Morning Interview: &#39;I Was Just A Jerk&#39; (VIDEO)',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.1WvzBG0AliA6qYtSJ19nhgHaLJ&pid=Api',
            datePublished: '2013-02-07T12:00:00.0000000Z',
            contentUrl:
              'http://i.huffpost.com/gen/980667/thumbs/o-JOHN-MAYER-CBS-facebook.jpg',
            hostPageUrl:
              'http://www.huffingtonpost.com/2013/02/07/john-mayers-cbs_n_2641135.html',
            contentSize: '864647 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'http://www.huffingtonpost.com/2013/02/07/john-mayers-cbs_n_2641135.html',
            width: 1536,
            height: 2312,
            thumbnail: {
              width: 474,
              height: 713,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=21F7D9E686C9C1A8C11431D7EDD67E20FFC80BCA&FORM=IARRTH',
            name:
              'John Mayer Net Worth 2017-2016, Bio, Wiki - RENEWED! - Celebrity Net Worth',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.w9c_bxhavwi07Gjipl3n4AHaFs&pid=Api',
            datePublished: '2017-03-21T02:44:00.0000000Z',
            contentUrl:
              'http://net-worths.org/wp-content/uploads/2013/09/John-Mayer.jpg',
            hostPageUrl: 'http://net-worths.org/john-mayer-net-worth/',
            contentSize: '145273 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl: 'http://net-worths.org/john-mayer-net-worth/',
            width: 1020,
            height: 785,
            thumbnail: {
              width: 474,
              height: 364,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=39210C62B43B097D94397A0BF8DFDEA9DAD67176&FORM=IARRTH',
            name: 'John Mayer Announces 2013 Tour - Full List of Concert Dates',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.MDKvaPpASgYwQPM1TjtUigHaKn&pid=Api',
            datePublished: '2013-03-22T03:05:00.0000000Z',
            contentUrl:
              'http://www.gossipcop.com/wp-content/uploads/2013/03/161419196.jpg',
            hostPageUrl:
              'http://www.gossipcop.com/john-mayer-2013-tour-dates-concerts-phillip-phillips/',
            contentSize: '1068091 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'http://www.gossipcop.com/john-mayer-2013-tour-dates-concerts-phillip-phillips/',
            width: 2092,
            height: 3000,
            thumbnail: {
              width: 474,
              height: 679,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=A9D4B1390841161E4638AE69DA57ABCE97DA5BB9&FORM=IARRTH',
            name: 'John Mayer: A Mini Biography',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.9HvZrtcgHQHkKuxF2IJZ7AHaEK&pid=Api',
            datePublished: '2017-01-07T17:21:00.0000000Z',
            contentUrl:
              'http://www.jambase.com/wp-content/uploads/2015/08/johnmayerpress.jpg',
            hostPageUrl:
              'https://www.theodysseyonline.com/john-mayer-biography',
            contentSize: '76907 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'https://www.theodysseyonline.com/john-mayer-biography',
            width: 1200,
            height: 675,
            thumbnail: {
              width: 474,
              height: 266,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=E4176ACFD949A47F9E9597A30AA1E0123731C5E8&FORM=IARRTH',
            name:
              '25+ best ideas about John mayer tattoo on Pinterest | John mayer say, John mayer new song and ...',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.i-DJR47eIo4ffjMfS_FHmQHaJ1&pid=Api',
            datePublished: '2017-07-23T00:52:00.0000000Z',
            contentUrl:
              'https://s-media-cache-ak0.pinimg.com/736x/de/59/32/de593266d57f101502f169f62a494ffd--style-men-mens-style.jpg',
            hostPageUrl: 'https://www.pinterest.com/explore/john-mayer-tattoo/',
            contentSize: '92193 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl:
              'https://www.pinterest.com/explore/john-mayer-tattoo/',
            width: 736,
            height: 978,
            thumbnail: {
              width: 474,
              height: 629,
            },
          },
          {
            webSearchUrl:
              'https://www.bing.com/images/search?q=john+mayer&id=04209C0ABD1CD93A22C913673FA63FD8B3F92782&FORM=IARRTH',
            name: 'john mayer | SHEmazing!',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OIP.CHojvfS6BQNSbhHYCAeBugHaFc&pid=Api',
            datePublished: '2017-05-04T21:25:00.0000000Z',
            contentUrl:
              'http://www.shemazing.net/wp-content/uploads/2016/09/john-mayer.jpg',
            hostPageUrl: 'http://www.shemazing.net/tag/john-mayer/',
            contentSize: '263316 B',
            encodingFormat: 'jpeg',
            hostPageDisplayUrl: 'http://www.shemazing.net/tag/john-mayer/',
            width: 600,
            height: 441,
            thumbnail: {
              width: 474,
              height: 348,
            },
          },
        ],
      },
      news: {
        id: 'https://api.cognitive.microsoft.com/api/v7/#News',
        readLink:
          'https://api.cognitive.microsoft.com/api/v7/news/search?q=John+Mayer',
        value: [
          {
            contractualRules: [
              {
                _type: 'ContractualRules/TextAttribution',
                text: 'Fox News',
              },
            ],
            name:
              'John Mayer sings hymn "How Great Thou Art" in touching Christchurch tribute',
            url:
              'https://www.foxnews.com/entertainment/john-mayer-sings-hymn-how-great-thou-art-in-touching-christchurch-tribute',
            description:
              'John Mayer opened a recent concert with an iconic hymn as a tribute to the Christchurch, New Zealand mosque shooting victims. Just days after the massacre that took at least 49 lives and injured dozens more at two mosques engaging in Friday prayers, the ...',
            about: [
              {
                readLink:
                  'https://api.cognitive.microsoft.com/api/v7/entities/387e0301-ffdd-71af-03bb-b5f0e54e604f',
                name: 'John Mayer',
              },
              {
                readLink:
                  'https://api.cognitive.microsoft.com/api/v7/entities/4e24946c-04bf-cf3b-920c-091a2f5e4dda',
                name: 'Christchurch',
              },
              {
                readLink:
                  'https://api.cognitive.microsoft.com/api/v7/entities/47c49855-f59e-1593-1dd0-d96ff509cfe5',
                name: 'Tribute',
              },
            ],
            mentions: [
              {
                name: 'John Mayer',
              },
              {
                name: 'Christchurch',
              },
              {
                name: 'Tribute',
              },
            ],
            provider: [
              {
                _type: 'Organization',
                name: 'Fox News',
                image: {
                  thumbnail: {
                    contentUrl:
                      'https://www.bing.com/th?id=AR_7dc0f55e947bdbc51189eb1a022e9eb6&pid=news',
                  },
                },
              },
            ],
            datePublished: '2019-04-08T14:14:00.0000000Z',
            category: 'Entertainment',
          },
          {
            contractualRules: [
              {
                _type: 'ContractualRules/TextAttribution',
                text: 'Hypebeast',
              },
            ],
            name:
              'NEIGHBORHOOD Rejoins John Mayer for Racing-Inspired Tour Merch',
            url: 'https://hypebeast.com/?post=4549767',
            image: {
              contentUrl:
                'https://image-cdn.hypb.st/https%3A//hypebeast.com/image/2019/04/john-mayer-neighborhood-world-tour-merch-collection-7.jpg?q=75&w=800&cbr=1&fit=max',
              thumbnail: {
                contentUrl:
                  'https://www.bing.com/th?id=ON.2BC73883E2D37A3459BBFF1B25E6C3EB&pid=News',
                width: 700,
                height: 466,
              },
            },
            description:
              'Long-time pals NEIGHBORHOOD and John Mayer reunite for the first time in approximately five years to issue a merch capsule in time for the Tokyo stop on Mayer’s world tour. encompassing a ...',
            provider: [
              {
                _type: 'Organization',
                name: 'Hypebeast',
                image: {
                  thumbnail: {
                    contentUrl:
                      'https://www.bing.com/th?id=AR_0e5d952e1e178b361c92112c68ac1bdc&pid=news',
                  },
                },
              },
            ],
            datePublished: '2019-04-08T18:49:00.0000000Z',
            category: 'Entertainment',
          },
          {
            contractualRules: [
              {
                _type: 'ContractualRules/TextAttribution',
                text: 'MusicRadar',
              },
            ],
            name:
              'John Mayer: “90 per cent of a guitar to me is the slack in the strings”',
            url:
              'https://www.musicradar.com/news/john-mayer-90-per-cent-of-a-guitar-to-me-is-the-slack-in-the-strings',
            image: {
              contentUrl:
                'https://cdn.mos.cms.futurecdn.net/b4BTN3x3JbF4Wic25NMtq-1200-80.jpg',
              thumbnail: {
                contentUrl:
                  'https://www.bing.com/th?id=ON.9D9F2DBE5DA3F7734FE08E11259BC4A9&pid=News',
                width: 700,
                height: 393,
              },
            },
            description:
              'Blues heartthrob and mastermind behind the PRS Silver Sky John Mayer has outlined what he believes is the key to a good electric guitar in a new video promoting his signature model. Speaking to Guitar Center, the elusive guitar hero claims it’s all down ...',
            provider: [
              {
                _type: 'Organization',
                name: 'MusicRadar',
                image: {
                  thumbnail: {
                    contentUrl:
                      'https://www.bing.com/th?id=AR_6a63cda4e9fc0e805a51b24263a9bc8e&pid=news',
                  },
                },
              },
            ],
            datePublished: '2019-04-08T11:12:00.0000000Z',
          },
          {
            contractualRules: [
              {
                _type: 'ContractualRules/TextAttribution',
                text: 'The Jakarta Post',
              },
            ],
            name: 'John Mayer hypnotizes Jakarta',
            url:
              'https://www.thejakartapost.com/life/2019/04/05/john-mayer-hypnotizes-jakarta.html',
            image: {
              contentUrl:
                'https://img.jakpost.net/c/2019/04/05/2019_04_05_69326_1554474164._large.jpg',
              thumbnail: {
                contentUrl:
                  'https://www.bing.com/th?id=ON.70542D03AC61299A4A3DA032A2E1298D&pid=News',
                width: 700,
                height: 466,
              },
            },
            description:
              'American singer-songwriter John Mayer performs at ICE BSD City in Tangerang, Banten, on Friday, April 5, as part of his Asia Tour 2019. (JP/Donny Fernando) With the Jakarta show of the John Mayer Australia &amp; Asia Tour 2019 at ICE BSD City in Tangerang ...',
            about: [
              {
                readLink:
                  'https://api.cognitive.microsoft.com/api/v7/entities/387e0301-ffdd-71af-03bb-b5f0e54e604f',
                name: 'John Mayer',
              },
              {
                readLink:
                  'https://api.cognitive.microsoft.com/api/v7/entities/6261fc72-a172-5cdd-9c67-a7644a026c29',
                name: 'Jakarta',
              },
            ],
            provider: [
              {
                _type: 'Organization',
                name: 'The Jakarta Post',
                image: {
                  thumbnail: {
                    contentUrl:
                      'https://www.bing.com/th?id=AR_c83b61649453e94f709711ce0f2ea01a&pid=news',
                  },
                },
              },
            ],
            datePublished: '2019-04-06T01:45:00.0000000Z',
            category: 'Entertainment',
          },
          {
            contractualRules: [
              {
                _type: 'ContractualRules/TextAttribution',
                text: 'Hometracks NASCAR',
              },
            ],
            name:
              'Sam Mayer Dominates Bristol For First K&amp;N Pro Series Victory',
            url:
              'https://hometracks.nascar.com/2019/04/06/sam-mayer-dominates-bristol-for-first-kn-pro-series-victory/',
            image: {
              contentUrl:
                'https://hometracks.nascar.com/wp-content/uploads/sites/13/2019/04/sam-mayer-bristol-ontrack-040619.png',
              thumbnail: {
                contentUrl:
                  'https://www.bing.com/th?id=ON.28C3173AB409CC93265BDEAA77308385&pid=News',
                width: 700,
                height: 373,
              },
            },
            description:
              'Sam Mayer’s No. 21 rode the low lane to his first career K&amp;N Pro Series victory. (John Harrelson/Nigel Kinrade Photography)',
            about: [
              {
                readLink:
                  'https://api.cognitive.microsoft.com/api/v7/entities/893defd6-1d7c-fd8c-5d9c-aca5a048ccb8',
                name: 'Bristol',
              },
              {
                readLink:
                  'https://api.cognitive.microsoft.com/api/v7/entities/027bf0de-029a-40de-a197-f80b4889cfbf',
                name: 'Sam Mayer',
              },
            ],
            provider: [
              {
                _type: 'Organization',
                name: 'Hometracks NASCAR',
              },
            ],
            datePublished: '2019-04-08T16:20:00.0000000Z',
            category: 'Sports',
          },
        ],
      },
      relatedSearches: {
        id: 'https://api.cognitive.microsoft.com/api/v7/#RelatedSearches',
        value: [
          {
            text: 'john mayer tour 2019 schedule',
            displayText: 'john mayer tour 2019 schedule',
            webSearchUrl:
              'https://www.bing.com/search?q=john+mayer+tour+2019+schedule',
          },
          {
            text: 'john mayer merch',
            displayText: 'john mayer merch',
            webSearchUrl: 'https://www.bing.com/search?q=john+mayer+merch',
          },
          {
            text: 'john mayer current girlfriend',
            displayText: 'john mayer current girlfriend',
            webSearchUrl:
              'https://www.bing.com/search?q=john+mayer+current+girlfriend',
          },
          {
            text: 'john mayer new girlfriend',
            displayText: 'john mayer new girlfriend',
            webSearchUrl:
              'https://www.bing.com/search?q=john+mayer+new+girlfriend',
          },
          {
            text: 'john mayer apparel',
            displayText: 'john mayer apparel',
            webSearchUrl: 'https://www.bing.com/search?q=john+mayer+apparel',
          },
          {
            text: 'john mayer songs',
            displayText: 'john mayer songs',
            webSearchUrl: 'https://www.bing.com/search?q=john+mayer+songs',
          },
          {
            text: 'john mayer youtube',
            displayText: 'john mayer youtube',
            webSearchUrl: 'https://www.bing.com/search?q=john+mayer+youtube',
          },
          {
            text: 'john mayer gravity',
            displayText: 'john mayer gravity',
            webSearchUrl: 'https://www.bing.com/search?q=john+mayer+gravity',
          },
        ],
      },
      videos: {
        id: 'https://api.cognitive.microsoft.com/api/v7/#Videos',
        readLink:
          'https://api.cognitive.microsoft.com/api/v7/videos/search?q=johh+mayer',
        webSearchUrl: 'https://www.bing.com/videos/search?q=johh+mayer',
        isFamilyFriendly: true,
        value: [
          {
            webSearchUrl:
              'https://www.bing.com/videos/search?q=johh%20mayer&view=detail&mid=ADDDA48A9DACDED1B531ADDDA48A9DACDED1B531',
            name: 'John Mayer - New Light',
            description:
              'Spotify: http://radi.al/NewLightSpotify Apple: http://radi.al/NewLightApple Amazon: http://radi.al/NewLightAMZ John Mayer “New Light” I’m the boy in your other phone Lighting up inside your drawer at home all alone Pushin 40 in the friend zone We talk and then you walk away every day Oh you don’t think twice bout me And maybe you’re ...',
            thumbnailUrl:
              'https://tse3.mm.bing.net/th?id=OVP.0X4diZoAEyyadIFNbaS6ewHgFo&pid=Api',
            datePublished: '2018-05-10T17:00:01.0000000',
            publisher: [
              {
                name: 'YouTube',
              },
            ],
            isAccessibleForFree: true,
            contentUrl: 'https://www.youtube.com/watch?v=2PH7dK6SLC8',
            hostPageUrl: 'https://www.youtube.com/watch?v=2PH7dK6SLC8',
            encodingFormat: 'mp4',
            hostPageDisplayUrl: 'https://www.youtube.com/watch?v=2PH7dK6SLC8',
            width: 1280,
            height: 720,
            duration: 'PT3M37S',
            motionThumbnailUrl:
              'https://tse3.mm.bing.net/th?id=OM.MbXR3qydiqTdrQ_1550014794&pid=Api',
            embedHtml:
              '&lt;iframe width=&quot;1280&quot; height=&quot;720&quot; src=&quot;http://www.youtube.com/embed/2PH7dK6SLC8?autoplay=1&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;',
            allowHttpsEmbed: true,
            viewCount: 12932499,
            thumbnail: {
              width: 160,
              height: 120,
            },
            allowMobileEmbed: true,
            isSuperfresh: false,
          },
          {
            webSearchUrl:
              'https://www.bing.com/videos/search?q=johh%20mayer&view=detail&mid=FEE55A29A7C504EBB099FEE55A29A7C504EBB099',
            name: 'John Mayer - New Light (Premium Content!)',
            description:
              '“New Light” available now: http://johnmayer.com (C) 2018 Snack Money',
            thumbnailUrl:
              'https://tse2.mm.bing.net/th?id=OVT.VF_mbDrBMWnKVrl_g_1554694818&pid=Api',
            datePublished: '2018-05-24T13:42:02.0000000',
            publisher: [
              {
                name: 'YouTube',
              },
            ],
            isAccessibleForFree: true,
            contentUrl: 'https://www.youtube.com/watch?v=mQ055hHdxbE',
            hostPageUrl: 'https://www.youtube.com/watch?v=mQ055hHdxbE',
            encodingFormat: 'mp4',
            hostPageDisplayUrl: 'https://www.youtube.com/watch?v=mQ055hHdxbE',
            width: 1280,
            height: 720,
            duration: 'PT3M49S',
            embedHtml:
              '&lt;iframe width=&quot;1280&quot; height=&quot;720&quot; src=&quot;http://www.youtube.com/embed/mQ055hHdxbE?autoplay=1&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;',
            allowHttpsEmbed: true,
            viewCount: 39163922,
            thumbnail: {
              width: 160,
              height: 119,
            },
            allowMobileEmbed: true,
            isSuperfresh: false,
          },
          {
            webSearchUrl:
              'https://www.bing.com/videos/search?q=johh%20mayer&view=detail&mid=D3FA4E01E8022EA3987DD3FA4E01E8022EA3987D',
            name: 'John Mayer - I Guess I Just Feel Like (Lyric Video)',
            description:
              '“I Guess I Just Feel Like” is available now: http://smarturl.it/iguessijustfeellike Amazon Music: http://smarturl.it/iguessijustfeellike/az Apple Music: http://smarturl.it/iguessijustfeellike/applemusic iTunes: http://smarturl.it/iguessijustfeellike/itunes Soundcloud: http://smarturl.it/iguessijustfeellike/soundcloud Spotify: http ...',
            thumbnailUrl:
              'https://tse2.mm.bing.net/th?id=OVP.e1ZKfFBh6feG4bgAbgnqHwHgFo&pid=Api',
            datePublished: '2019-02-22T05:00:00.0000000',
            publisher: [
              {
                name: 'YouTube',
              },
            ],
            isAccessibleForFree: true,
            contentUrl: 'https://www.youtube.com/watch?v=CQEoLHeI0tA',
            hostPageUrl: 'https://www.youtube.com/watch?v=CQEoLHeI0tA',
            encodingFormat: '',
            hostPageDisplayUrl: 'https://www.youtube.com/watch?v=CQEoLHeI0tA',
            width: 1280,
            height: 720,
            duration: 'PT4M47S',
            embedHtml:
              '&lt;iframe width=&quot;1280&quot; height=&quot;720&quot; src=&quot;http://www.youtube.com/embed/CQEoLHeI0tA?autoplay=1&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;',
            allowHttpsEmbed: true,
            viewCount: 2641598,
            thumbnail: {
              width: 160,
              height: 120,
            },
            allowMobileEmbed: true,
            isSuperfresh: false,
          },
          {
            webSearchUrl:
              'https://www.bing.com/videos/search?q=johh%20mayer&view=detail&mid=9C5D2832B286BF21A7419C5D2832B286BF21A741',
            name: 'John Mayer - Say',
            description:
              'Music video by John Mayer performing Say. (C) 2007 Aware Records LLC http://vevo.ly/pRORaV',
            thumbnailUrl:
              'https://tse2.mm.bing.net/th?id=OVP.nzop4HXFC38MEOWLJcPOGwHgFo&pid=Api',
            datePublished: '2018-05-05T00:21:19.0000000',
            publisher: [
              {
                name: 'YouTube',
              },
            ],
            isAccessibleForFree: true,
            contentUrl: 'https://www.youtube.com/watch?v=phaIklEphSM',
            hostPageUrl: 'https://www.youtube.com/watch?v=phaIklEphSM',
            encodingFormat: 'mp4',
            hostPageDisplayUrl: 'https://www.youtube.com/watch?v=phaIklEphSM',
            width: 1280,
            height: 720,
            duration: 'PT3M52S',
            motionThumbnailUrl:
              'https://tse2.mm.bing.net/th?id=OM.Qachv4ayMihdnA_1553689274&pid=Api',
            embedHtml:
              '&lt;iframe width=&quot;1280&quot; height=&quot;720&quot; src=&quot;http://www.youtube.com/embed/phaIklEphSM?autoplay=1&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;',
            allowHttpsEmbed: true,
            viewCount: 3127777,
            thumbnail: {
              width: 160,
              height: 120,
            },
            allowMobileEmbed: true,
            isSuperfresh: false,
          },
          {
            webSearchUrl:
              'https://www.bing.com/videos/search?q=johh%20mayer&view=detail&mid=8B6DD33531D85098B2A48B6DD33531D85098B2A4',
            name: 'John Mayer - Still Feel Like Your Man (Video)',
            description:
              '&quot;Still Feel Like Your Man&quot; off John Mayer&#39;s album &#39;The Search for Everything&#39; is available now: http://smarturl.it/TSFE?iqid=SFLYM.video iTunes: http://smarturl.it/tsfe-it?iqid=SFLYM.video Spotify: http://smarturl.it/tsfe-sp?iqid=SFLYM.video Apple Music: http://smarturl.it/tsfe-am?iqid=SFLYM.video Amazon Music: http://smarturl.it/tsfe-amz?iqid ...',
            thumbnailUrl:
              'https://tse2.mm.bing.net/th?id=OVP.R59ekSBvbcSrLUcCub4gdwHgFo&pid=Api',
            datePublished: '2017-04-05T14:00:02.0000000',
            publisher: [
              {
                name: 'YouTube',
              },
            ],
            isAccessibleForFree: true,
            contentUrl: 'https://www.youtube.com/watch?v=NyCst7We6Uw',
            hostPageUrl: 'https://www.youtube.com/watch?v=NyCst7We6Uw',
            encodingFormat: 'mp4',
            hostPageDisplayUrl: 'https://www.youtube.com/watch?v=NyCst7We6Uw',
            width: 1280,
            height: 720,
            duration: 'PT4M11S',
            motionThumbnailUrl:
              'https://tse2.mm.bing.net/th?id=OM.pLKYUNgxNdNtiw_1554419512&pid=Api',
            embedHtml:
              '&lt;iframe width=&quot;1280&quot; height=&quot;720&quot; src=&quot;http://www.youtube.com/embed/NyCst7We6Uw?autoplay=1&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;',
            allowHttpsEmbed: true,
            viewCount: 13115482,
            thumbnail: {
              width: 160,
              height: 120,
            },
            allowMobileEmbed: true,
            isSuperfresh: false,
          },
          {
            webSearchUrl:
              'https://www.bing.com/videos/search?q=johh%20mayer&view=detail&mid=E7911F903716E07AF5EFE7911F903716E07AF5EF',
            name:
              'John Mayer - Your Body Is A Wonderland (Official Music Video)',
            description:
              'John Mayer&#39;s official music video for &#39;Your Body Is A Wonderland&#39;. Click to listen to John Mayer on Spotify: http://smarturl.it/JMayerSpotify?IQid=JMayerYBisW As featured on Room For Squares. Click to buy the track or album via iTunes: http://smarturl.it/JMayerClctniTunes?IQid=JMayerYBisW Google Play: http://smarturl.it/JMayerYBiaWplay?IQid ...',
            thumbnailUrl:
              'https://tse2.mm.bing.net/th?id=OVP.b5s5YGxPECo4TritYH2pZQHgFo&pid=Api',
            datePublished: '2009-10-03T04:47:25.0000000',
            publisher: [
              {
                name: 'YouTube',
              },
            ],
            isAccessibleForFree: true,
            contentUrl: 'https://www.youtube.com/watch?v=N5EnGwXV_Pg',
            hostPageUrl: 'https://www.youtube.com/watch?v=N5EnGwXV_Pg',
            encodingFormat: 'mp4',
            hostPageDisplayUrl: 'https://www.youtube.com/watch?v=N5EnGwXV_Pg',
            width: 1280,
            height: 720,
            duration: 'PT4M17S',
            motionThumbnailUrl:
              'https://tse2.mm.bing.net/th?id=OM.7_V64BY3kB-R5w_1551940911&pid=Api',
            embedHtml:
              '&lt;iframe width=&quot;1280&quot; height=&quot;720&quot; src=&quot;http://www.youtube.com/embed/N5EnGwXV_Pg?autoplay=1&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;',
            allowHttpsEmbed: true,
            viewCount: 63109704,
            thumbnail: {
              width: 160,
              height: 120,
            },
            allowMobileEmbed: true,
            isSuperfresh: false,
          },
          {
            webSearchUrl:
              'https://www.bing.com/videos/search?q=johh%20mayer&view=detail&mid=8D12C56D64C33A0DB69D8D12C56D64C33A0DB69D',
            name:
              'John Mayer - Waiting On the World to Change (Official Music Video)',
            description:
              'John Mayer&#39;s official music video for &#39;Waiting On The World To Change&#39;. Click to listen to John Mayer on Spotify: http://smarturl.it/JMayerSpotify?IQid... As featured on Continuum. Click to buy the track or album via iTunes: http://smarturl.it/JMayerClctniTunes?... Google Play: http://smarturl.it/JMayerWftWtCplay?I... Amazon: http://smarturl.it ...',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OVP.6klZbL6ptA1sLacNOc-vGQHgFo&pid=Api',
            datePublished: '2009-10-03T20:59:04.0000000',
            publisher: [
              {
                name: 'YouTube',
              },
            ],
            isAccessibleForFree: true,
            contentUrl: 'https://www.youtube.com/watch?v=oBIxScJ5rlY',
            hostPageUrl: 'https://www.youtube.com/watch?v=oBIxScJ5rlY',
            encodingFormat: 'mp4',
            hostPageDisplayUrl: 'https://www.youtube.com/watch?v=oBIxScJ5rlY',
            width: 1280,
            height: 720,
            duration: 'PT3M22S',
            motionThumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OM.nbYNOsNkbcUSjQ_1551069724&pid=Api',
            embedHtml:
              '&lt;iframe width=&quot;1280&quot; height=&quot;720&quot; src=&quot;http://www.youtube.com/embed/oBIxScJ5rlY?autoplay=1&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;',
            allowHttpsEmbed: true,
            viewCount: 40640146,
            thumbnail: {
              width: 160,
              height: 120,
            },
            allowMobileEmbed: true,
            isSuperfresh: false,
          },
          {
            webSearchUrl:
              'https://www.bing.com/videos/search?q=johh%20mayer&view=detail&mid=CED2C5C365C2703E75BACED2C5C365C2703E75BA',
            name: 'John Mayer - Daughters (Official Music Video)',
            description:
              'John Mayer&#39;s official music video for &#39;Daughters&#39;. Click to listen to John Mayer on Spotify: http://smarturl.it/JMayerSpotify?IQid=JMayerDau As featured on Heavier Things. Click to buy the track or album via iTunes: http://smarturl.it/JMayerClctniTunes?IQid=JMayerDau Google Play: http://smarturl.it/JMayerDauplay?IQid=JMayerDau Amazon: http ...',
            thumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OVP.hw6VijaKCTcOnn1Tol6kEwHfFn&pid=Api',
            datePublished: '2009-10-03T04:48:27.0000000',
            publisher: [
              {
                name: 'YouTube',
              },
            ],
            isAccessibleForFree: true,
            contentUrl: 'https://www.youtube.com/watch?v=rZLbUIa7exE',
            hostPageUrl: 'https://www.youtube.com/watch?v=rZLbUIa7exE',
            encodingFormat: 'mp4',
            hostPageDisplayUrl: 'https://www.youtube.com/watch?v=rZLbUIa7exE',
            width: 1280,
            height: 720,
            duration: 'PT3M58S',
            motionThumbnailUrl:
              'https://tse1.mm.bing.net/th?id=OM.unU-cMJlw8XSzg_1549843874&pid=Api',
            embedHtml:
              '&lt;iframe width=&quot;1280&quot; height=&quot;720&quot; src=&quot;http://www.youtube.com/embed/rZLbUIa7exE?autoplay=1&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;',
            allowHttpsEmbed: true,
            viewCount: 26985405,
            thumbnail: {
              width: 160,
              height: 119,
            },
            allowMobileEmbed: true,
            isSuperfresh: false,
          },
          {
            webSearchUrl:
              'https://www.bing.com/videos/search?q=johh%20mayer&view=detail&mid=53BA72A7DBB30A9A147653BA72A7DBB30A9A1476',
            name: 'John Mayer - Half of My Heart (Official Music Video)',
            description:
              'John Mayer&#39;s official music video for &#39;Half Of My Heart&#39;. Click to listen to John Mayer on Spotify: http://smarturl.it/JMayerSpotify?IQid... As featured on Battle Studies. Click to buy the track or album via iTunes: http://smarturl.it/JMayerClctniTunes?... Google Play: http://smarturl.it/JMayerHomHplay?IQi... Amazon: http://smarturl.it ...',
            thumbnailUrl:
              'https://tse3.mm.bing.net/th?id=OVP.YI5klfU9C8AcBhU16sWhlQHgFo&pid=Api',
            datePublished: '2010-06-01T22:50:18.0000000',
            publisher: [
              {
                name: 'YouTube',
              },
            ],
            isAccessibleForFree: true,
            contentUrl: 'https://www.youtube.com/watch?v=aojTGWAqUIQ',
            hostPageUrl: 'https://www.youtube.com/watch?v=aojTGWAqUIQ',
            encodingFormat: 'mp4',
            hostPageDisplayUrl: 'https://www.youtube.com/watch?v=aojTGWAqUIQ',
            width: 1280,
            height: 720,
            duration: 'PT4M2S',
            motionThumbnailUrl:
              'https://tse3.mm.bing.net/th?id=OM.dhSaCrPbp3K6Uw_1551020243&pid=Api',
            embedHtml:
              '&lt;iframe width=&quot;1280&quot; height=&quot;720&quot; src=&quot;http://www.youtube.com/embed/aojTGWAqUIQ?autoplay=1&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;',
            allowHttpsEmbed: true,
            viewCount: 30830606,
            thumbnail: {
              width: 160,
              height: 120,
            },
            allowMobileEmbed: true,
            isSuperfresh: false,
          },
          {
            webSearchUrl:
              'https://www.bing.com/videos/search?q=johh%20mayer&view=detail&mid=87652D67BEC6E7AF3A1087652D67BEC6E7AF3A10',
            name: 'John Mayer - Queen of California (Video)',
            description:
              'John Mayer&#39;s official music video for &#39;Queen Of California&#39;. Click to listen to John Mayer on Spotify: http://smarturl.it/JMayerSpotify?IQid=JMayerQoC As featured on Born And Raised. Click to buy the track or album via iTunes: http://smarturl.it/JMayerBaRiTunes?IQid=JMayerQoC Google Play: http://smarturl.it/JMayerQoCplay?IQid=JMayerQoC Amazon ...',
            thumbnailUrl:
              'https://tse4.mm.bing.net/th?id=OVP.wcU1Se1MxxeywL8vMKJMYQHfFn&pid=Api',
            datePublished: '2012-07-30T07:00:24.0000000',
            publisher: [
              {
                name: 'YouTube',
              },
            ],
            isAccessibleForFree: true,
            contentUrl: 'https://www.youtube.com/watch?v=cSdjo0W4Tvs',
            hostPageUrl: 'https://www.youtube.com/watch?v=cSdjo0W4Tvs',
            encodingFormat: 'mp4',
            hostPageDisplayUrl: 'https://www.youtube.com/watch?v=cSdjo0W4Tvs',
            width: 1280,
            height: 720,
            duration: 'PT4M33S',
            motionThumbnailUrl:
              'https://tse4.mm.bing.net/th?id=OM.EDqv58a-Zy1lhw_1551962093&pid=Api',
            embedHtml:
              '&lt;iframe width=&quot;1280&quot; height=&quot;720&quot; src=&quot;http://www.youtube.com/embed/cSdjo0W4Tvs?autoplay=1&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;',
            allowHttpsEmbed: true,
            viewCount: 6673616,
            thumbnail: {
              width: 160,
              height: 119,
            },
            allowMobileEmbed: true,
            isSuperfresh: false,
          },
        ],
        scenario: 'List',
      },
      rankingResponse: {
        mainline: {
          items: [
            {
              answerType: 'Ads',
              resultIndex: 0,
              value: {
                id: 'https://www.bingapis.com/api/v7/#Ads.0',
              },
            },
            {
              answerType: 'Ads',
              resultIndex: 1,
              value: {
                id: 'https://www.bingapis.com/api/v7/#Ads.1',
              },
            },
            {
              answerType: 'Ads',
              resultIndex: 2,
              value: {
                id: 'https://www.bingapis.com/api/v7/#Ads.2',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 3,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.0',
              },
            },
            {
              answerType: 'News',
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#News',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 4,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.1',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 5,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.2',
              },
            },
            {
              answerType: 'Videos',
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#Videos',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 6,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.3',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 7,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.4',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 8,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.5',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 9,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.6',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 10,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.7',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 11,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.8',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 12,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.9',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 13,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.10',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 14,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.11',
              },
            },
            {
              answerType: 'WebPages',
              resultIndex: 15,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#WebPages.12',
              },
            },
            {
              answerType: 'RelatedSearches',
              value: {
                id:
                  'https://api.cognitive.microsoft.com/api/v7/#RelatedSearches',
              },
            },
          ],
        },
        sidebar: {
          items: [
            {
              answerType: 'Images',
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#Images',
              },
            },
            {
              answerType: 'Entities',
              resultIndex: 0,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#Entities.0',
              },
            },
            {
              answerType: 'Entities',
              resultIndex: 1,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#Entities.1',
              },
            },
            {
              answerType: 'Entities',
              resultIndex: 2,
              value: {
                id: 'https://api.cognitive.microsoft.com/api/v7/#Entities.2',
              },
            },
          ],
        },
      },
    },
  })
