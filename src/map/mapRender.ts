import {Coords} from "../boat";
import {IMap} from "./map";
import {DEFAULT_MAP_CONFIG} from "./constants";

export class MapRender {
    private readonly rootNode: HTMLElement | null;
    mapElement: Element | null = null;

    constructor(rootNode: HTMLElement | null) {
        this.rootNode = rootNode;
    }

    renderMap(map: IMap | null) {
        const mapElement = document.createElement('div');
        this.mapElement = mapElement;
        this.mapElement.className = 'ship-map';

        this.rootNode?.appendChild(mapElement);

        map?.forEach(row => {
            const mapRow = this.produceElement('div', 'map-row', mapElement);
            mapRow.style.display = 'flex';

            row.forEach(cell => {
                this.renderMapCell(mapRow, {height: DEFAULT_MAP_CONFIG.cellHeight, width: DEFAULT_MAP_CONFIG.cellWidth});
            })
        })
    }

    highLightCell(coords: Coords) {
        const cell = this.getCell(coords);
        this.highLightElement(cell, '#ffbbbb', 'red');
    }

    deleteHighLight(coords: Coords) {
        const cell = this.getCell(coords);
        this.highLightElement(cell, '#cccccc', 'black');
    }

    private getCell(coords: Coords) {
        const row = this.mapElement?.children[coords.y];
        return row?.children[coords.x];
    }

    private highLightElement(element: any, color: string, borderColor: string) {
        element.style.backgroundColor = color;
        element.style.border = `1px solid ${borderColor}`;
    }

    private renderMapCell(mapRow: HTMLElement, size: any) {
        const mapCell = this.produceElement('div', 'map-cell', mapRow);

        mapCell.style.height = size.height + 'px';
        mapCell.style.width = size.width + 'px';
        mapCell.style.border = '1px solid black';
        mapCell.style.backgroundColor = '#cccccc';
    }

    private produceElement<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        className: string,
        parentElement: HTMLElement
    ): HTMLElement {
        const newElement = document.createElement(tagName);
        newElement.className = className;
        parentElement.appendChild(newElement);
        return newElement
    }
}
