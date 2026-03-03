import { CvNode } from "./CvNode";
import { resolveOpName } from "./resolveOpName";

type Instance = CvNode;
type Props = Record<string, unknown>;

const NOOP = () => {};

const RESERVED_PROPS = new Set(["children", "key", "ref"]);

function extractOpProps(props: Props): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (!RESERVED_PROPS.has(key)) {
      result[key] = props[key];
    }
  }
  return result;
}

function shallowDiff(
  oldProps: Props,
  newProps: Props,
): Props | null {
  const allKeys = new Set([
    ...Object.keys(oldProps),
    ...Object.keys(newProps),
  ]);
  let changed = false;
  const diff: Props = {};
  for (const key of allKeys) {
    if (RESERVED_PROPS.has(key)) continue;
    if (oldProps[key] !== newProps[key]) {
      changed = true;
      diff[key] = newProps[key];
    }
  }
  return changed ? diff : null;
}

const DefaultEventPriority = 0b0000000000000000000000000010000;
let currentUpdatePriority = 0;

// Dummy context for HostTransitionContext (not used, but required by types)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HostTransitionContext = { $$typeof: Symbol.for("react.context"), _currentValue: null, _currentValue2: null, _threadCount: 0, Provider: null, Consumer: null } as any;

export const hostConfig = {
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  isPrimaryRenderer: false,
  noTimeout: -1,

  createInstance(type: string, props: Props): Instance {
    const opName = resolveOpName(type);
    return new CvNode(opName, extractOpProps(props));
  },

  createTextInstance(): never {
    throw new Error("Text nodes are not supported in cv-elements");
  },

  appendInitialChild(parent: Instance, child: Instance) {
    parent.appendChild(child);
  },

  appendChild(parent: Instance, child: Instance) {
    parent.appendChild(child);
  },

  appendChildToContainer(container: CvNode, child: Instance) {
    container.appendChild(child);
    child.propagateNotify(container._rootNotify);
    container._rootNotify?.();
  },

  removeChild(parent: Instance, child: Instance) {
    parent.removeChild(child);
  },

  removeChildFromContainer(container: CvNode, child: Instance) {
    container.removeChild(child);
    container._rootNotify?.();
  },

  insertBefore(parent: Instance, child: Instance, before: Instance) {
    parent.insertBefore(child, before);
  },

  insertInContainerBefore(container: CvNode, child: Instance, before: Instance) {
    container.insertBefore(child, before);
    child.propagateNotify(container._rootNotify);
    container._rootNotify?.();
  },

  commitUpdate(
    instance: Instance,
    _type: string,
    oldProps: Props,
    newProps: Props,
  ) {
    const diff = shallowDiff(oldProps, newProps);
    if (!diff) return;
    Object.assign(instance.props, diff);
    instance._rootNotify?.();
  },

  finalizeInitialChildren(): boolean {
    return false;
  },

  prepareForCommit(): null {
    return null;
  },

  resetAfterCommit(container: CvNode) {
    container._rootNotify?.();
  },

  getPublicInstance(instance: Instance): Instance {
    return instance;
  },

  getRootHostContext() {
    return {};
  },

  getChildHostContext() {
    return {};
  },

  shouldSetTextContent(): boolean {
    return false;
  },

  clearContainer(container: CvNode) {
    container.children = [];
  },

  preparePortalMount: NOOP,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,

  getCurrentUpdatePriority: () => currentUpdatePriority,
  setCurrentUpdatePriority: (priority: number) => { currentUpdatePriority = priority; },
  resolveUpdatePriority: () => currentUpdatePriority || DefaultEventPriority,

  getInstanceFromNode: () => null,
  prepareScopeUpdate: NOOP,
  getInstanceFromScope: () => null,
  detachDeletedInstance: NOOP,
  beforeActiveInstanceBlur: NOOP,
  afterActiveInstanceBlur: NOOP,

  resetFormInstance: NOOP,
  requestPostPaintCallback: (cb: (time: number) => void) => { requestAnimationFrame((t) => cb(t)); },
  shouldAttemptEagerTransition: () => false,
  trackSchedulerEvent: NOOP,
  resolveEventType: () => null,
  resolveEventTimeStamp: () => -1.1,

  maySuspendCommit: () => false,
  preloadInstance: () => true,
  startSuspendingCommit: NOOP,
  suspendInstance: NOOP,
  waitForCommitToBeReady: () => null,

  NotPendingTransition: null,
  HostTransitionContext,
};
