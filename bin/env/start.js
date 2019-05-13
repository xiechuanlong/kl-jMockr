#!/usr/bin/env node
/**
 * 需求功能
 * 1. 根据当前分支生成生成两种环境标， 看是否符合， Y/N, Y则供其选择， N则让用户自己输入环境标名称
 * 2. 选择好后生成.env文件和.env_history, .env是当前文件的配置，.env_history则是历史的配置， 后续可以考虑只保留一个礼拜的历史配置
 * 3. kl-jmockr优先读取.env和.env_history中的数据， 然后没有再读取config中的数据
 */
const inquirer = require("inquirer");
const chalk = require("chalk");
const shell = require("shelljs");
const {fileOrDir, readFile, writeFile} = require('./file')
const childProcess = require('child_process')

function getAutoEnv() {
// 根据分支生成默认的环境标
    const childProcess = require('child_process')
    const branch = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s+/, '')
    const tempArr = branch.split('_')
    if(tempArr.length==5) { //分支强约束
        return [`kta${tempArr[2]}jdb2`, `kre${tempArr[2]}jdb2`]
    }
    return false
}
const askEnvSelect= () => {
    const autoEnv = getAutoEnv()
    const questions = [
        {
            name: "isUseDefault",
            type: "confirm",
            message: `是否使用默认的环境标(1. ${autoEnv[0]}; 2. ${autoEnv[1]})?`,
            when: function(answers) {
                return autoEnv
            }
        },
        {
            name: "entranceEnv",
            type: "list",
            message: "请选择环境标",
            choices: [`${autoEnv[0]}`, `${autoEnv[1]}`],
            when: function(answers) { // 当watch为true的时候才会提问当前问题
                return answers.isUseDefault
            }
        },
        {
            name: "entranceEnv",
            type: "input",
            message: "请输入你要代理到测试环境的的环境标?",
            when: function(answers) { // 当watch为true的时候才会提问当前问题
                return !answers.isUseDefault
            }
        },
        {
            name: "isProxy",
            type: "confirm",
            message: `是否使用代理开发？`,
        }
    ];
    return inquirer.prompt(questions);
};

const updateEnvFile = (entranceEnv, isProxy) => {
    return new Promise(async (resolve, reject) => {
        const path = `${process.cwd()}/.env`
        // 更新.env文件
        const file =  await fileOrDir(path);
        if(!file && !file.isFile) {
            // 生成.env文件, 并写入配置文件
            shell.touch(path);
            resolve()
        }
        await writeFile(path, JSON.stringify({entranceEnv, isProxy}))
        resolve()
    })
}

const updateEnvHistoryFile = (entranceEnv = '') => {
    return new Promise(async (resolve, reject) => {
        const path = `${process.cwd()}/.env_history`
        // 更新.env_history文件
        const file =  await fileOrDir(path);
        if(!file && !file.isFile) {
            // 生成.env_history文件
            shell.touch(path);
            await writeFile(path, JSON.stringify(entranceEnv))
            resolve()
        }

        if(file && file.isFile) {
            // 更新配置文件，去重处理
            let data = await readFile(path)
            let dataArr = data.split('\n')
            if(!dataArr.includes(entranceEnv)) {
                data = data?`${data}\n${entranceEnv}`:`${entranceEnv}`
                await writeFile(path, data)
            }
            resolve()
        }
    })
}

const success = filepath => {
console.log(
    chalk.white.bgGreen.bold(`entranceEnv and proxy is done!`)
);
};

const run = async () => {
const { entranceEnv, isProxy } = await askEnvSelect(); //获取到了环境标
    await updateEnvFile(entranceEnv, isProxy)
    await updateEnvHistoryFile(entranceEnv)
    success();
    process.exit(0)
};
run();