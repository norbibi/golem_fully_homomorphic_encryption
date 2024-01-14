import { TaskExecutor } from "@golem-sdk/golem-js";
import { program, Option } from "commander";
import crypto from "crypto";
import { execSync } from "child_process";
import { readFile } from 'fs/promises'
import { readdirSync } from 'fs'

const appKey = process.env["YAGNA_APPKEY"];

async function main(subnet, payment_driver, payment_network, providerid, computation, operand1, operand2) {

  execSync(`docker run --rm -v $PWD/${computation}:/usr/src maugnorbert/openfhe -g ${operand1} ${operand2}`);

  let propFilter = undefined
  if(providerid != "")
    propFilter = async (proposal) => {
      var decision = false;
      if(proposal.provider.id == providerid)
          decision = true;
      return decision;
    };

  const executor = await TaskExecutor.create({
    package: "0d3473473adcff03bef7b672461a88da382d29c6ae2a8791551971d6",
    subnetTag: subnet,
    payment: { driver: payment_driver, network: payment_network },
    maxParallelTasks: 1,
    proposalFilter: propFilter,
    taskTimeout: 60*60*1000,
  });

  let runningTask = executor.run(async (ctx) => {
    try
    {
      let files = ['cryptocontext.txt', 'key-public.txt', 'ciphertext1.txt', 'ciphertext2.txt'];

      let promise = ctx.beginBatch()
      promise.uploadFile(`${computation}/build/my_fhe_computation_compute`, '/golem/resources/my_fhe_computation_compute')
      files.forEach(async (file) => {
        promise = promise.uploadFile(`${computation}/data/${file}`, `/golem/resources/${file}`)
      });

      promise = promise
        .run("mv /golem/resources/* /golem/work/")
        .run("chmod +x /golem/work/my_fhe_computation_compute")
        .run("cd /golem/work && ./my_fhe_computation_compute")
        .run("mv /golem/work/cipherresult.txt /golem/output/")
        .downloadFile("/golem/output/cipherresult.txt", `${computation}/data/cipherresult.txt`)
        .end();

      const results = await promise;

      let result = execSync(`docker run --rm -v $PWD/${computation}:/usr/src maugnorbert/openfhe -d`).toString().trim();

      console.log('################################################');
      console.log(`Result: ${operand1} + ${operand2} = ${result}`);
      console.log('################################################');
    } catch (error) {
      console.error("Computation failed:", error);
    }
  })

  try {
    await runningTask;
  } finally {
    await executor.shutdown();
  }
}

program
  .option("--subnet <subnet>", "subnet", "public")
  .option("--paymentdriver <paymentdriver>", "paymentdriver", "erc20")
  .option("--paymentnetwork <paymentnetwork>", "paymentnetwork", "polygon")
  .option("--providerid <providerid>", "providerid", "")
  .option("--computation <computation>", "computation", "my_fhe_computation")
  .option("--operand1 <operand1>", "operand1", Number, 8)
  .option("--operand2 <operand2>", "operand2", Number, 13)

program.parse();
const options = program.opts();

main(options.subnet, options.paymentdriver, options.paymentnetwork, options.providerid, options.computation, options.operand1, options.operand2);

// docker run -ti --rm -v $PWD/my_fhe_computation:/usr/src maugnorbert/openfhe
// node fully_homomorphic_encryption.mjs --providerid 0x50a6612d55f95ea34f3f82b189ee33dba34c44c4 --computation my_fhe_add --operand1 15 --operand2 8
