import { spawn } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import { platform } from 'os';
import { join } from 'path';

import { getJSON } from './json';

const getLastSaveGame = dir => {
  if (!existsSync(dir)) {
    return null;
  }

  const files = readdirSync(dir);
  const sorted = files
    .map(name => {
      const p = join(dir, name);
      return { path: name, ctime: statSync(p).ctime };
    })
    .sort((a, b) => b.ctime - a.ctime);

  return sorted.length ? sorted[0].path : null;
};

const play = async (pack, selected, loadLast = false, oblige = null) => {
  let deh = [];
  let bex = [];
  let file = [];
  let params = [];
  const { iwad } = pack;

  try {
    const sourceports = await getJSON('sourceports');
    const settings = await getJSON('settings');
    const sourceport = sourceports.find(i => i.id === pack.sourceport);

    selected.forEach(i => {
      switch (i.kind) {
        case 'DEH':
          deh.push(i.path);
          break;
        case 'BEX':
          bex.push(i.path);
          break;
        default:
          file.push(i.path);
      }
    });

    if (typeof oblige === 'object' && oblige !== null && oblige.path) {
      file.push(oblige.path);
    } else if (typeof oblige === 'boolean' && oblige === true) {
      file.push(join(settings.savepath, pack.datapath, 'generated.wad'));
    }

    let COMMAND = ['-iwad', iwad, '-file', ...file];

    if (sourceport.hasConfig) {
      params = params.concat([
        sourceport.paramConfig,
        join(settings.savepath, pack.datapath, sourceport.configFilename)
      ]);
    }

    if (sourceport.hasSavedir) {
      params = params.concat([
        sourceport.paramSave,
        join(settings.savepath, pack.datapath, 'saves')
      ]);

      if (loadLast) {
        const savePath = join(settings.savepath, pack.datapath, 'saves');
        const save = getLastSaveGame(savePath);
        if (save) {
          const fullSave = sourceport.useFullPath ? join(savePath, save) : save;
          COMMAND = COMMAND.concat([sourceport.paramLoad, fullSave]);
        }
      }
    }

    if (params.length > 0) {
      COMMAND = COMMAND.concat(params);
    }

    if (deh.length > 0) {
      COMMAND = COMMAND.concat(['-deh', ...deh]);
    }

    if (bex.length > 0) {
      COMMAND = COMMAND.concat(['-bex', ...bex]);
    }

    if (pack.userparams && pack.userparams.trim() !== '') {
      const USERPARAMS = pack.userparams.match(/(?:[^\s"]+|"[^"]*")+/g).map(i =>
        i
          .replace('<data>', settings.savepath)
          .replace('<package>', join(settings.savepath, pack.datapath))
          .replace(/['"]+/g, '')
      );

      COMMAND = COMMAND.concat(USERPARAMS);
    }

    if (platform() === 'darwin') {
      let MAC = [sourceport.binary, '--args'];
      COMMAND = [...MAC, ...COMMAND];
      console.log(COMMAND.join(' '));
      const proc = spawn('open', COMMAND, {
        detached: true,
        stdio: 'ignore'
      });
      proc.unref();
    } else {
      console.log(COMMAND.join(' '));
      const proc = spawn(sourceport.binary, COMMAND, {
        detached: true,
        stdio: 'ignore'
      });
      proc.unref();
    }

    return {
      data: pack,
      error: null
    };
  } catch (e) {
    console.log(e);
    return {
      data: null,
      error: e.message
    };
  }
};

export default play;
