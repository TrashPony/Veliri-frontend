function ShieldMove(shieldState, pathUnit) {
    if (!game || !game.radar_marks) return;

    let shield = shields[shieldState.uuid];
    if (!shield) {
        shield = CreateShieldSprite(shieldState);
    }

    // game.add.tween(shield.sprite).to({
    //         x: pathUnit.x,
    //         y: pathUnit.y
    //     }, pathUnit.millisecond, Phaser.Easing.Linear.None, true, 0
    // );
    //
    // game.add.tween(shield.border).to({
    //         x: pathUnit.x,
    //         y: pathUnit.y
    //     }, pathUnit.millisecond, Phaser.Easing.Linear.None, true, 0
    // );
}

export {ShieldMove}
