/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Invest.css';
import cx from 'classnames';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { Rail, Slider, Handles, Tracks } from 'react-compound-slider';
import { Handle, Track } from './SliderComponents';
import { setValue } from '../../actions/organizer';
import { connect } from 'react-redux';

class Invest extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  calcProfit(counterCapacity, counterYield, counterPrice) {
    console.log('calc profit', counterCapacity, counterYield, counterPrice);
    if (isNaN(counterCapacity) || isNaN(counterYield) || isNaN(counterPrice)) {
      return 'Syöttöarvojen täytyy olla numeroita';
    }
    const profit =
      parseFloat(counterCapacity) *
      parseFloat(counterYield) *
      parseFloat(counterPrice);
    return profit;
  }

  calcExpenses(counterCapacity, counterYield) {
    if (isNaN(counterCapacity) || isNaN(counterYield)) {
      return 'Syöttöarvojen täytyy olla numeroita';
    }

    const expenses =
      4500 +
      parseFloat(counterCapacity) * parseFloat(counterYield) * 2 +
      parseFloat(counterCapacity) * 11 * 0.1;
    return expenses;
  }

  counterInput(name, field, value, from, to, defaultValue, unit, labels, step) {
    const { setValue } = this.props;

    const sliderStyle = {
      position: 'relative',
      width: '100%',
    };

    const railStyle = {
      position: 'absolute',
      width: '100%',
      height: 14,
      borderRadius: 7,
      cursor: 'pointer',
      backgroundColor: 'rgb(155,155,155)',
    };

    const domain = [100, 500];
    const defaultValues = [150];

    return (
      <div className={s.counterInput}>
        <div className={s.counterInputControls}>
          <div className={s.counterInputName}>{name}</div>
          <div className={s.counterSlider}>
            <Slider
              mode={1}
              step={step}
              domain={[from, to]}
              rootStyle={sliderStyle}
              onUpdate={values => {
                setValue(field, values[0]);
              }}
              onChange={values => {
                setValue(field, values[0]);
              }}
              values={[defaultValue]}
            >
              <Rail>
                {({ getRailProps }) => (
                  <div style={railStyle} {...getRailProps()} />
                )}
              </Rail>
              <Handles>
                {({ handles, getHandleProps }) => (
                  <div className="slider-handles">
                    {handles.map(handle => (
                      <Handle
                        key={handle.id}
                        handle={handle}
                        domain={domain}
                        getHandleProps={getHandleProps}
                      />
                    ))}
                  </div>
                )}
              </Handles>
              <Tracks right={false}>
                {({ tracks, getTrackProps }) => (
                  <div className="slider-tracks">
                    {tracks.map(({ id, source, target }) => (
                      <Track
                        key={id}
                        source={source}
                        target={target}
                        getTrackProps={getTrackProps}
                      />
                    ))}
                  </div>
                )}
              </Tracks>
            </Slider>
          </div>
        </div>
        <div className={s.counterInputValue}>
          <div className={s.numericalValue}>{value || defaultValue}</div>
          <div className={s.inputUnit}>{unit}</div>
        </div>
      </div>
    );
  }

  render() {
    console.log('invest props', this.props);

    const {
      setValue,
      counterCapacity,
      counterYield,
      counterPrice,
    } = this.props;

    console.log('render invest', this.props, counterCapacity);

    let requiredInvestment = 0;

    const capacity = counterCapacity || 1000;
    if (capacity > 500) {
      requiredInvestment = 40 * (capacity - 500);
      if (capacity > 1000) {
        requiredInvestment += 25000;
      }
      if (capacity > 1500) {
        requiredInvestment += 25000;
      }
    }

    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.preface}>
            Crispy Crickets Oy harjoittaa kotisirkan alkutuotantoa Suomessa ja
            kehittää informaatioteknologiaa alkutuotannon globaaleille
            markkinoille.
          </div>
          <div className={cx(s.row, s.row1)}>
            <div className={s.rowText}>
              <div className={s.sectionHeader}>KOTISIRKAN ALKUTUOTANTO</div>
              <div className={s.sectionText}>
                <div>
                  Tuotantolaitoksemme on valmistunut kesällä 2018 ja edustaa
                  edistyneintä eurooppalaista sirkankasvatusteknologiaa
                  biologian, laitteiston ja prosessiteknolgian osalta. Toimimme
                  yhteistyössä kokeneen sirkankasvatusteknologian toimittajan
                  Entocube Oy:n kanssa.
                </div>
                <div>
                  Laitoksen nykyinen tuotantokapasiteetti on 700-800 kg
                  kuukaudessa. Tuotantokapasiteetti laajennettavissa
                  välittömästi pienellä lisäinvestoinnilla 1400-1800 kiloon
                  kuukaudessa. Maksimaalinen laajennusvara yli 3000 kiloon
                  kuukaudessa.
                </div>
              </div>
            </div>
            <div className={s.rowMedia}>
              <iframe
                width="100%"
                height="400px"
                src="https://www.youtube.com/embed/tgbNymZ7vqY"
              />
            </div>
          </div>
          <div className={cx(s.row, s.row2)}>
            <div className={s.rowText}>
              <div className={s.sectionHeader}>TEKNOLOGIAN KEHITYS</div>
              <div className={s.sectionText}>
                <div>
                  Yrityksessämme yhdistyy alkutuotannon liiketoiminnan
                  ymmärtäminen sekä uuden ajan teknologioiden osaaminen ja
                  kokemus IT-liiketoiminnasta. Tuotekehityksen tukena on
                  rakentamamme hyönteisalkutuotannon infrastruktuuri ja
                  testilaboratorio.
                </div>
                <div>
                  Teknologisena ja liiketoiminnallisena yhteistyökumppaninamme
                  on Entocube Oy, jonka kautta olemme myös verkostoituneet
                  muihin hyönteistuottajiin, jotka ovat innovaatiomme
                  pääasiallinen kohderyhmä.
                </div>
                <div>
                  Kehitämme ohjelmistojärjestelmiä hyönteistalouden tarpeisiin
                  ja pitemmän aikavälin projektina alkutuotantotalouden
                  markkina-alustaa globaaleille alkutuotantomarkkinoille.
                  Liioittelematon tavoitteemme on mullistaa alkutuotannon
                  markkinat ja päästä osallisiksi alan biljoonien dollarien
                  liikevaihdosta.
                </div>
              </div>
            </div>
            <div className={s.rowMedia}>
              <iframe
                width="100%"
                height="400px"
                src="https://www.youtube.com/embed/tgbNymZ7vqY"
              />
            </div>
          </div>
          <div className={cx(s.row, s.row3)}>
            <div className={s.rowText}>
              <div className={s.sectionHeader}>
                KASVUPOTENTIAALI JA HAASTEET
              </div>
              <div className={s.sectionText}>
                <div>
                  Sirkan alkutuotannon tuottavuuteen vaikuttaa neljä tekijää:
                  tuotantotoiminnan mittakaava, tuotantoprosessin laatu, sirkan
                  markkinahinnat ja myynnin tehokkuus. Voimme vaikuttaa kaikkiin
                  muihin tekijöihin paitsi sirkan markkinahintaan. Itsestämme
                  riippuvista tekijöistä suurin haasteemme on myynti, koska
                  kokemuksemme tällä liikatoiminnan alueella on puutteellinen.
                  Mittakaavan kasvattamiseen meillä on erinomaiset valmiudet,
                  koska nykyinen tuotantolaitos on rakennettu skaalattavaksi ja
                  merkittävimmät tekniset kasvuinvestoinnit on tehty.
                  Prosessitekninen tietotaitomme on puolen vuoden raskaan työn
                  ja virheistä oppimsen kautta vahva alueemme, mutta siinäkin on
                  vielä potentiaalia tuottavuuden kasvulle.
                </div>
                <div>
                  Alla olevalla laskurilla voit laskea sirkan
                  alkutuotantotoiminnan tuottavuutta. Koska kaikissa neljässä
                  tuottavuuden tekijässä vaihtelu voi olla suurta, toiminnan
                  voitollisuuden ennusteen ääripäät ovat 15 000 € ja 85 000 €.
                  Realistinen kuukausittainen voitto on 40 000 - 60 000 €
                  hyödyntäen tuotantotilamme täyttä kapasiteettia.
                </div>
              </div>
              <div className={s.counterContainer}>
                <div className={s.counterControls}>
                  <div className={s.counterInputs}>
                    {this.counterInput(
                      'Volyymi',
                      'counterCapacity',
                      counterCapacity,
                      500,
                      2000,
                      1000,
                      'yksikköä',
                      { 500: '500', 2000: '2000' },
                      1,
                    )}
                    {this.counterInput(
                      'Tuottavuus',
                      'counterYield',
                      counterYield,
                      1.3,
                      1.9,
                      1.5,
                      'kg/yksikkö',
                      { 1.3: '1.3', 1.9: '1.9' },
                      0.01,
                    )}
                    {this.counterInput(
                      'Myyntihinta',
                      'counterPrice',
                      counterPrice,
                      15,
                      30,
                      20,
                      '€/kg',
                      { 15: '15', 30: '30' },
                      1,
                    )}
                  </div>
                </div>
                <div className={s.counterResults}>
                  <div className={s.monthlyEconomy}>
                    <div className={s.monthlyEconomyHeader}>Kuukausitalous</div>
                    <div className={s.monthlyEconomyBody}>
                      <div className={s.counterRevenue}>
                        <div className={s.resultHeader}>Tulot</div>
                        <div className={s.resultValue}>
                          {Math.round(
                            this.calcProfit(
                              counterCapacity || 1000,
                              counterYield || 1.5,
                              counterPrice || 20,
                            ),
                          )}{' '}
                          €
                        </div>
                      </div>
                      <div className={s.counterExpenses}>
                        <div className={s.resultHeader}>Menot</div>
                        <div className={s.resultValue}>
                          -{' '}
                          {Math.round(
                            this.calcExpenses(
                              counterCapacity || 1000,
                              counterYield || 1.5,
                            ),
                          )}{' '}
                          €
                        </div>
                      </div>
                      <div className={s.counterProfit}>
                        <div className={s.resultHeader}>Voitto</div>
                        <div className={s.resultValue}>
                          {Math.round(
                            this.calcProfit(
                              counterCapacity || 1000,
                              counterYield || 1.5,
                              counterPrice || 20,
                            ) -
                              this.calcExpenses(
                                counterCapacity || 1000,
                                counterYield || 1.5,
                              ),
                          )}{' '}
                          €
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={s.requiredInvestment}>
                    <div className={s.requiredInvestmentHeader}>
                      Rahoitustarve
                    </div>
                    <div className={s.requiredInvestmentBody}>
                      {requiredInvestment} €
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={cx(s.row, s.row4)}>
            <div className={s.rowText}>
              <div className={s.sectionHeader}>
                TALOUSTILANNE JA SIJOITUKSET
              </div>
              <div className={s.sectionText}>
                <div>
                  Yrityksessä on 120 000 € matalakorkoista lainarahaa, joka on
                  käytetty tuotantolaitoksen rakentamiseen ja
                  tuotantotoiminnan käynnistämisen aikaisiin juokseviin kuluihin
                  kuten vuokraan. Lisäksi vireillä on hakemus 50 000 € tuelle
                  Business Finlandilta. Lainalla on 80 000 € Finnveran takaus.
                </div>
                <div>
                  Olemme valmistautuneet myymään 20-80% yrityksestä
                  turvataksemme katkeamattoman toiminnan ja
                  alkutuotantotoiminnan kasvun rahoituksen. Business Finlandin
                  tuen turvin kehitettävä alkutuotannon markkina-alusta
                  muodostaa liiketoiminta-alueen, jolla on eniten
                  kasvupotentiaalia ja myös potentiaalia kasvattaa yrityksen
                  arvoa lyhyellä aikavälillä (1 - 1.5v). Lähtökohtaisesti
                  pidätämme oikeuden myydä alkusijoittajien osuus uusille
                  sjoittajille seuraavassa rahoituskierroksessa. Neuvottelemme
                  alkusijoittajien kanssa heidän myyntivoittojensa mahdollisesta
                  käytöstä jatkoinvestointeihin.
                </div>
              </div>
            </div>
          </div>
          <div className={s.hidden}>
            Kehitämme lohkoketjuun perustuvaa alkutuotannon markkina-alustaa,
            jonka innovaatioita ovat mm. futuuriostot, joissa ostajalla on
            mahdollisuus ostaa tuotetta edullisemmin jakamalla tuotannon riskit
            tuottajan kanssa, hajautettu alkuperän ja tuotantoprosessin
            seurantajärjestelmä sekä smart contractit ostosopimuksille, joiden
            kaikkien luottamuspohja perustuu lohkoketjun hajautettuun
            luonteeseen. Ansaintsemme rahaa ostosopimusten provisioista
            globaalin alkutuotantotalouden 3 triljoonan dollarin liikevaihdosta.
            Nykyinen alkutuotantotalous perustuu kahdenvälisiin ostosopimuksiin
            tuottajan ja ostajan välillä kunkin maan juridisen kentän ja
            kansainvälisten sopimusten puitteissa. Tämä asetelma asettaa
            tuottajat epäedulliseen asemaan ja rajoittaa kuluttujan
            valinnanvaraa, koska yksittäiset vaikutusvaltaiset ostajat ja eri
            tuotantoaloja hallitsevat tuottajat säätelevät hintoja käyttäen
            hyväkseen monopolia muistuttavaa asemaansa sekä kansainvälisiä ja
            valtion sisäisiä sijoitusmarkkinoita kyllästäen markkinat
            tuotteella, jonka hintatason kanssa muut tuottajat eivät voi
            kilpailla. Perinteiset valtion ja pankkijärjestelmän instituutioihin
            pohjautuvat markkinamekanismit mahdollistavat yksittäisten
            toimijoiden valta-aseman, joka on ristiriidassa vapaiden
            markkinoiden periaatteen kanssa, koska se on saavutettu ja
            ylläpidetty näiden mekanismien turvin. Kilpailijat on syrjäytetty
            markkinoiden marginaaliin ja kapea markkinaosuus sekä markkinoiden
            yleinen hintataso rajoittavat kilpailua ja muiden tuottajien kykyä
            harjoittaa kannattavaa liiketoimintaa ja tarjota kilpailevia
            tuotteita. Meidän markkina-alustamme tarjoaa globaalin
            markkinapaikan, jossa kysyntä ja tarjonta kohtaavat suoraan, koska
            se on riippumaton valtioiden, agrokartellien ja pankkien
            hallitsemien sijoitusmarkkinoiden vaikutusvallasta. Tämän
            mahdollistaa lohkoketjusovellus, joka siirtää markkinat pois
            pelikentältä, joka on monopoliasemassa olevien tuottajien, ostajien
            ja perinteisten osake- ja sijoitusinstrumenttien välittäjien
            hallinnassa. Hajautetun arkkitehtuurinsa ja kryptografisten
            varmennusominaisuuksiensa vuoksi lohkoketjuun tallennetut sopimukset
            ovat luotettavia siinä määrin, missä pankkien takaamat tili- ja
            sopimustiedot ovat. Ne ovat jopa luotettavammat, koska pankki ja
            tätä takaava valtio oikeusjärjestelmineen ovat alttiimpia ulkoisille
            ja sisäisille vaikutuksille ja ympäristön muutoksille kuin
            globaalisti hajautettu lohkoketju. Markkina-alustamme mahdollistaa
            kaupankäynnin alkutuotannon tuotteilla siten, että isot ja pienet
            tuottajat kilpailevat aidosti vapaiden markkinoiden pelisäännöillä.
            Markkina-alustamme tuo kaikki globaalit markkinat välittömästi
            jokaisen tuottajan ulottuville ja kaiken globaalin tarjonnan
            kerralla jokaisen ostajan ulottuville. Tuottaja voi julkaista
            tuotantoeriensä alkuperä- ja tuotantoprosessitiedot
            järjestelmässämme, jolloin lohkoketju takaa niiden täyden
            luotettavuuden. Alustamme tarjoaa myös kaupankäyntiominaisuuden,
            jolla ostaja voi ostaa tuotteen jo ennen kuin se on tuotettu jakaen
            tuotantoriskin tuottajan kanssa sellaiseen hintaan, joka on sovittu
            tuottajan ja ostajan välillä. Markkina-alustamme toimii myös
            pörssinä, jossa eri tuottajilta ostetuilla tuotteilla voi käydä
            kauppaa yhdistellen niitä isommiksi eriksi. Markkina-alustamme
            sopimusmekanismi on juridisesti sitova lohkoketjun
            luottamusauktoriteetin vuoksi. Palvelumme tarjoaa työkalut ja
            ohjelmistot, joilla jokainen käyttäjä pääsee hyödyntämään
            markkina-alustaa helppokäyttöisen käyttöliittymän kautta.
          </div>
        </div>
      </div>
    );
  }
}

const mapState = state => {
  console.log('state', state);
  return { ...state.organizer };
};

const mapDispatch = {
  setValue,
};

export default connect(mapState, mapDispatch)(compose(withStyles(s))(Invest));
