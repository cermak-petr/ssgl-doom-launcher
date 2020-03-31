import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import styled from 'styled-components';

import styles from '#Style';

import covers from '../../assets/ssgl-iwad-covers';
import { ButtonStyle } from '../../components/Form/Button';
import Icon from '../../components/Mods/Icon';
import { StoreContext } from '../../state';
import { image, setTitle, useTranslation } from '../../utils';

const Package = motion.custom(styled.div`
  display: inline-block;
  position: relative;
  margin: 0 10px 10px 0;
  background-color: rgba(12, 8, 8, 0.8);
  background-image: ${p => `url("${image(p.cover)}");`};
  background-size: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: ${styles.border.radius};
  border: 1px solid ${styles.border.idle};
  user-select: none;
  width: 280px;
  height: 180px;
  overflow: hidden;

  &:hover {
    transition: ${styles.transition.out};
    background-size: 116%;
    border: 1px solid ${styles.border.active};
  }

  & h1 {
    display: block;
    width: 240px;
    font-size: 18px;
    margin-bottom: 5px;
    transition: ${styles.transition.out};
    text-transform: uppercase;
  }

  &:hover h1 {
    color: ${styles.color.active};
  }

  &:hover div {
    color: white;
  }

  .delete {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .content {
    width: 260px;
    height: 160px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease-out;

    &:hover {
      background: rgba(0, 0, 0, 0.8);
    }
  }
`);

const Meta = styled.div`
  color: ${styles.color.meta};
  font-size: 14px;
  margin-bottom: 5px;
  text-shadow: 2 1px 1px black, 2 -1px -1px black;
  transition: ${styles.transition.out};
`;

const Button = styled(ButtonStyle)`
  display: inline;
  min-width: auto;
  width: 80px;
  padding: 3px 0 3px 0;
  margin-top: 5px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  left: 10px;
  bottom: 10px;
`;

const Pack = ({ pack, onUse, onData, onPlay, onDelete }) => {
  setTitle('packages');
  const { gstate } = useContext(StoreContext);
  const { t } = useTranslation(['packages', 'common']);

  const cover = pack.cover.isFile ? pack.cover.use : covers[pack.cover.use];
  const sourceport = gstate.sourceports.find(i => i.id === pack.sourceport);

  return (
    <Package
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1
      }}
      exit={{ opacity: 0 }}
      positionTransition={{ type: 'tween' }}
      cover={cover}
    >
      <div className="content">
        <div className="delete">
          <Icon
            stroke="white"
            name="times"
            width="17"
            onClick={onDelete(pack.id)}
          />
        </div>
        <h1>{pack.name}</h1>
        <Meta>
          {sourceport.name} - {pack.selected.length} Mods
        </Meta>
        <Meta>
          {pack.lastplayed === 0
            ? t('packages:never')
            : t('packages:lastplayed', { value: pack.lastplayed })}
        </Meta>

        <ButtonContainer>
          <Button type="button" onClick={onPlay(pack, sourceport)}>
            {t('packages:play')}
          </Button>
          <Button type="button" onClick={onUse(pack.id)}>
            {t('packages:use')}
          </Button>

          <Button type="button" onClick={onData(pack.datapath)}>
            {t('packages:datadir')}
          </Button>
        </ButtonContainer>
      </div>
    </Package>
  );
};

Pack.propTypes = {
  onDelete: PropTypes.func.isRequired,
  pack: PropTypes.any.isRequired,
  style: PropTypes.any,
  onUse: PropTypes.func.isRequired,
  onData: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired
};

export default Pack;
