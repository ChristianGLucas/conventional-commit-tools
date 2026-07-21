// Shared test context and an independent oracle for conventional-commit-tools
// node unit tests. Not a node and not a test file (no describe/it), so it is
// neither registered as a node nor collected by jest.
import {
  AxiomContext,
  AxiomLogger,
  AxiomSecrets,
  AxiomReflection,
  AxiomMutation,
} from '../gen/axiomContext';

const reflection: AxiomReflection = {
  flow: {
    nodes: [],
    edges: [],
    loopEdges: [],
    position: { currentInstance: 0, depth: 0, loopIterations: {}, subflowStackGraphIds: [] },
    graphId: '',
  },
};

const mutation: AxiomMutation = {
  flow: {
    addNode: (_p: string, _v: string) => 0,
    addEdge: (_s: number, _d: number) => {},
  },
};

export const ctx: AxiomContext = {
  log: { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} } satisfies AxiomLogger,
  secrets: { get: (_n: string): [string, boolean] => ['', false] } satisfies AxiomSecrets,
  executionId: 'test-execution-id',
  flowId: 'test-flow-id',
  tenantId: 'test-tenant-id',
  reflection,
  mutation,
};

/**
 * INDEPENDENT ORACLE — the Conventional Commits v1.0.0 spec's OWN worked
 * "Examples" section (https://www.conventionalcommits.org/en/v1.0.0/#examples),
 * transcribed verbatim, with the expected structure hand-derived from
 * reading the spec text itself (not from running this package's code or
 * conventional-commits-parser). Agreement with these is evidence this
 * package actually implements the spec, not merely that it agrees with
 * itself.
 */
export interface SpecExample {
  name: string;
  message: string;
  type: string;
  scope: string;
  breaking: boolean;
  breakingSource: 'marker' | 'footer' | 'both' | 'none';
  subject: string;
  releaseType: 'major' | 'minor' | 'patch' | 'none';
}

export const SPEC_EXAMPLES: SpecExample[] = [
  {
    name: 'description and breaking change footer',
    message:
      'feat: allow provided config object to extend other configs\n\n' +
      'BREAKING CHANGE: `extends` key in config file is now used for extending other config files',
    type: 'feat',
    scope: '',
    breaking: true,
    breakingSource: 'footer',
    subject: 'allow provided config object to extend other configs',
    releaseType: 'major',
  },
  {
    name: '! to draw attention to breaking change',
    message: 'feat!: send an email to the customer when a product is shipped',
    type: 'feat',
    scope: '',
    breaking: true,
    breakingSource: 'marker',
    subject: 'send an email to the customer when a product is shipped',
    releaseType: 'major',
  },
  {
    name: 'scope and ! to draw attention to breaking change',
    message: 'feat(api)!: send an email to the customer when a product is shipped',
    type: 'feat',
    scope: 'api',
    breaking: true,
    breakingSource: 'marker',
    subject: 'send an email to the customer when a product is shipped',
    releaseType: 'major',
  },
  {
    name: 'both ! and BREAKING CHANGE footer',
    message: 'chore!: drop support for Node 6\n\nBREAKING CHANGE: use JavaScript features not available in Node 6.',
    type: 'chore',
    scope: '',
    breaking: true,
    breakingSource: 'both',
    subject: 'drop support for Node 6',
    releaseType: 'major',
  },
  {
    name: 'no body',
    message: 'docs: correct spelling of CHANGELOG',
    type: 'docs',
    scope: '',
    breaking: false,
    breakingSource: 'none',
    subject: 'correct spelling of CHANGELOG',
    releaseType: 'none',
  },
  {
    name: 'scope',
    message: 'feat(lang): add Polish language',
    type: 'feat',
    scope: 'lang',
    breaking: false,
    breakingSource: 'none',
    subject: 'add Polish language',
    releaseType: 'minor',
  },
  {
    name: 'multi-paragraph body and multiple footers',
    message:
      'fix: prevent racing of requests\n\n' +
      'Introduce a request id and a reference to latest request. Dismiss\n' +
      'incoming responses other than from latest request.\n\n' +
      'Remove timeouts which were used to mitigate the racing issue but are\n' +
      'obsolete now.\n\n' +
      'Reviewed-by: Z\n' +
      'Refs: #123',
    type: 'fix',
    scope: '',
    breaking: false,
    breakingSource: 'none',
    subject: 'prevent racing of requests',
    releaseType: 'patch',
  },
];
