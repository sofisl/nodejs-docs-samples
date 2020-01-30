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

const path = require('path');
const assert = require('assert');
const uuid = require('uuid');
const childProcess = require('child_process');

const projectId = process.env.GCLOUD_PROJECT;
const cloudRegion = 'us-central1';

const cwdDatasets = path.join(__dirname, '../../datasets');
const cwd = path.join(__dirname, '..');
const datasetId = `nodejs-docs-samples-test-dicomweb-${uuid.v4()}`.replace(
  /-/gi,
  '_'
);
const dicomStoreId = `nodejs-docs-samples-test-dicomweb-dicom-store${uuid.v4()}`.replace(
  /-/gi,
  '_'
);

const dcmFile = 'resources/IM-0002-0001-JPEG-BASELINE.dcm';

// The Uids are not assigned by the server and are part of the metadata
// of dcmFile.
const studyUid = '1.2.840.113619.2.176.3596.3364818.7819.1259708454.105';
const seriesUid = '1.2.840.113619.2.176.3596.3364818.7819.1259708454.108';
const instanceUid = '1.2.840.113619.2.176.3596.3364818.7271.1259708501.876';

before(async () => {
  assert(
    process.env.GCLOUD_PROJECT,
    `Must set GCLOUD_PROJECT environment variable!`
  );
  assert(
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    `Must set GOOGLE_APPLICATION_CREDENTIALS environment variable!`
  );
  await childProcess.execSync(
    `node createDataset.js ${projectId} ${cloudRegion} ${datasetId}`,
    cwdDatasets
  );
  await childProcess.execSync(
    `node createDicomStore.js ${projectId} ${cloudRegion} ${datasetId} ${dicomStoreId}`,
    cwd
  );
});
after(async () => {
  try {
    await childProcess.execSync(
      `node deleteDicomStore.js ${projectId} ${cloudRegion} ${datasetId} ${dicomStoreId}`,
      cwd
    );
    await childProcess.execSync(
      `node deleteDataset.js ${datasetId}`,
      cwdDatasets
    );
  } catch (err) {} // Ignore error
});

it('should store a DICOM instance', async () => {
  const output = await childProcess.execSync(
    `node dicomWebStoreInstance.js ${projectId} ${cloudRegion} ${datasetId} ${dicomStoreId} ${dcmFile}`,
    cwd
  );
  assert.ok(output.includes('Stored DICOM instance'));
});

it('should search DICOM instances', async () => {
  const output = await childProcess.execSync(
    `node dicomWebSearchForInstances.js ${projectId} ${cloudRegion} ${datasetId} ${dicomStoreId}`,
    cwd
  );
  assert.ok(output.includes('Found'));
});

it('should retrieve a DICOM study', async () => {
  const output = await childProcess.execSync(
    `node dicomWebRetrieveStudy.js ${projectId} ${cloudRegion} ${datasetId} ${dicomStoreId} ${studyUid}`,
    cwd
  );
  assert.ok(output.includes('Retrieved study'));
});

it('should retrieve a DICOM instance', async () => {
  const output = await childProcess.execSync(
    `node dicomWebRetrieveInstance.js ${projectId} ${cloudRegion} ${datasetId} ${dicomStoreId} ${studyUid} ${seriesUid} ${instanceUid}`,
    cwd
  );
  assert.ok(output.includes('Retrieved DICOM instance'));
});

it('should retrieve a DICOM rendered PNG image', async () => {
  const output = await childProcess.execSync(
    `node dicomWebRetrieveRendered.js ${projectId} ${cloudRegion} ${datasetId} ${dicomStoreId} ${studyUid} ${seriesUid} ${instanceUid}`,
    cwd
  );
  assert.ok(output.includes('Retrieved rendered image'));
});

it('should search for DICOM studies', async () => {
  const output = await childProcess.execSync(
    `node dicomWebSearchStudies.js ${projectId} ${cloudRegion} ${datasetId} ${dicomStoreId}`,
    cwd
  );
  assert.ok(output.includes('Found'));
});

it('should delete a DICOM study', async () => {
  const output = await childProcess.execSync(
    `node dicomWebDeleteStudy.js ${projectId} ${cloudRegion} ${datasetId} ${dicomStoreId} ${studyUid}`,
    cwd
  );
  assert.ok(output.includes('Deleted study'));
});
