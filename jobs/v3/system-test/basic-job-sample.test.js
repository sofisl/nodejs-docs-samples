// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const assert = require(`assert`);
const childProcess = require(`child_process`);
const runSample = `require('./basic-job-sample').runSample()`;

it(`Should create a job, get a job, update a job, update a job with field mask, and delete a job`, async () => {
  const output = await childProcess.execSync(`node -e ${runSample}`);
  const pattern =
    `.*Job generated:.*\n` +
    `.*Job created:.*\n` +
    `.*Job existed:.*\n` +
    `.*Job updated:.*changedDescription.*\n` +
    `.*Job updated:.*changedJobTitle.*\n` +
    `.*Job deleted.*`;

  assert.strictEqual(new RegExp(pattern).test(output), true);
});
