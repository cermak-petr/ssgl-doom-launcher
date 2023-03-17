import { remote } from 'electron';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { BoxStyle } from '../../components/Box';
import Flex from '../../components/Flex';
import Logo from '../../components/Logo';
import AnimatedView from '../AnimatedView';
import { contact, techs, testers } from './data';

// backdrop:
const Box = styled(BoxStyle)`
  background: rgba(0, 0, 0, 0.7);

  .content {
    margin-bottom: 0;
  }
`;

const Text = styled.div`
  h1 {
    font-size: 20px;
    text-transform: uppercase;
    text-align: center;
  }

  h2 {
    font-size: 16px;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 18px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .link {
    color: ${({ theme }) => theme.color.active};
    transition: ${({ theme }) => theme.transition.out};
    cursor: pointer;

    & .meta {
      font-size: 14px;
      opacity: 0.6;
    }

    &:hover {
      color: white;
    }
  }

  ul {
    color: red;
    list-style-type: square;
    padding-left: 20px;
    margin: 10px;
    margin-bottom: 30px;
  }

  li {
    margin-bottom: 5px;
  }
`;

const Link = ({ children, to }) => {
  const onClick = () => remote.shell.openExternal(to);
  return (
    <span onClick={onClick} className="link">
      {children}
    </span>
  );
};

Link.propTypes = {
  children: PropTypes.any,
  to: PropTypes.string
};

const About = () => {
  return (
    <AnimatedView>
      <Box>
        <div className="scroll">
          <div className="content">
            <Text>
              <h1>
                SSGL (Super Shotgun Launcher) Version {remote.app.getVersion()}
              </h1>
              <Logo height="90px" center />
              <br /> <br />
              <Flex.Grid>
                <Flex.Col>
                  <h3>Used Technologies</h3>
                  <ul>
                    {techs.map(i => (
                      <li key={i.name}>
                        <Link to={i.link}>{i.name}</Link>
                      </li>
                    ))}
                  </ul>
                </Flex.Col>
                <Flex.Col>
                  <h3>Shoutout to my Alphatesters</h3>
                  <ul>
                    {testers.map(i => (
                      <li key={i.name}>
                        <Link to={i.link}>
                          {i.name} <br />
                          <span className="meta">{i.role}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Flex.Col>
                <Flex.Col>
                  <h3>If you want to Contact me</h3>
                  <ul>
                    {contact.map(i => (
                      <li key={i.platform}>
                        <Link to={i.link}>{i.platform}</Link>
                      </li>
                    ))}
                  </ul>
                </Flex.Col>
              </Flex.Grid>
              <p style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                All Icons and Graphics included in this Project are created{' '}
                <br /> by me (Thomas Petrovic) and Licensed under{' '}
                <Link to="https://creativecommons.org/licenses/by-nc/4.0/">
                  CC BY-NC 4.0
                </Link>{' '}
                <br />
                <br />
                Code Licensed under{' '}
                <Link to="https://github.com/FreaKzero/ssgl-doom-launcher/blob/latest/app/LICENSE">
                  MIT License
                </Link>
                <br />
                Copyright (c) 2015 Thomas Petrovic
                <br />
                <br />
                Minor fixes and updates beyond version 2.0.0
                <br />
                Petr Cermak -&nbsp;
                <Link to="https://github.com/cermak-petr/ssgl-doom-launcher">
                  GitHub repo
                </Link>
              </p>
              <p
                style={{
                  fontSize: '14px',
                  textAlign: 'center',
                  marginTop: '15px'
                }}
              >
                DOOM is a registered Trademark of id Software LLC, a Zenimax
                Media company in the US and/or other Countries, and is used
                without permission. All other Trademarks are the property of
                their respective holders. SSGL is in no way affiliated with nor
                endorsed by id Software.
              </p>
              <p style={{ textAlign: 'right' }}>
                Handcrafted in Vienna, Austria
              </p>
            </Text>
          </div>
        </div>
      </Box>
    </AnimatedView>
  );
};
export default About;
