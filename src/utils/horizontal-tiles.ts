import * as THREE from 'three';
import { proxy } from 'valtio';

interface Props {
  clicked: null | number;
  urls: string[];
}

export const damp = THREE.MathUtils.damp;
export const state = proxy<Props>({
  clicked: null,
  urls: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
  ].map((u) => `/images/my-love/${u}.jpeg`)
});
