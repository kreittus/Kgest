import { GridOverlay } from '@material-ui/data-grid';
import { LinearProgress } from '@material-ui/core';

export function CustomLoadingOverlayPsl({ loadingRegistros }) {
    return (
        <GridOverlay>
            <div style={{ position: 'absolute', top: 0, width: '100%' }}>
                {loadingRegistros ? <LinearProgress /> : <></>}
            </div>
        </GridOverlay>
    );
}