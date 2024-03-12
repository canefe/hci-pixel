import { Scene } from 'phaser'
import { shakeBattleStore } from '$lib/shakeBattleStore'

enum Status {
	PLAYING,
	PAUSED,
	GAME_OVER
}

export class ShakeBattleScene extends Scene {
	private asteroidSpawnTime: number
	private lastAsteroidTime: number
	private spawnRateDecrease: number
	private minSpawnTime: number
	private status: Status = Status.PLAYING
	private gameOverText: Phaser.GameObjects.Text | undefined
	private score = 0
	private handleOrientationBound
	private ball: Phaser.Physics.Arcade.Image | undefined

	private asteroids: Phaser.Physics.Arcade.Group | undefined

	constructor() {
		super({ key: 'ShakeBattleScene' })
		this.asteroidSpawnTime = 1000 // Initial spawn time for asteroids in milliseconds
		this.lastAsteroidTime = 0 // Time since last asteroid was spawned
		this.spawnRateDecrease = 20 // How much faster asteroids spawn over time
		this.minSpawnTime = 200 // Minimum spawn time to prevent impossible difficulty
		this.handleOrientationBound = this.handleOrientation.bind(this)
	}

	preload() {
		this.load.image('logo', 'logo.png')
		this.load.image('ball', 'ball.png')
		this.load.image('asteroid', 'ball.png')
	}

	handleOrientation(e: DeviceOrientationEvent) {
		const x = e.gamma
		const y = e.beta
		if (this.ball && x && y) this.ball.setVelocity(x * 20, (-1 + y) * 20)
	}

	create() {
		// make like its sky and asteroids coming randomly
		this.gameOverText = this.add.text(0, 0, 'Score: ' + this.score, { fontSize: '64px' })
		this.ball = this.physics.add.image(400, 300, 'ball')
		this.ball.setCollideWorldBounds(true)
		this.ball.setBounce(1)

		window.addEventListener('deviceorientation', this.handleOrientationBound, true)

		this.asteroids = this.physics.add.group()

		this.physics.add.collider(
			this.ball,
			this.asteroids,
			(player, asteroid) => {
				this.status = Status.GAME_OVER
			},
			null,
			this
		)
	}

	update(time, delta) {
		if (time > this.lastAsteroidTime + this.asteroidSpawnTime) {
			this.spawnAsteroid()
			this.lastAsteroidTime = time
			this.asteroidSpawnTime = Math.max(
				this.minSpawnTime,
				this.asteroidSpawnTime - this.spawnRateDecrease
			)
			this.score += 5
			this.gameOverText?.setText('Score: ' + this.score)
		}
		// Update the score

		if (this.status === Status.GAME_OVER) {
			this.scene.pause()

			this.asteroids.clear(true, true)

			this.gameOverText.visible = true

			this.cleanup()
			this.game.destroy(true)

			shakeBattleStore.updateState({ score: this.score })
		}
	}

	cleanup() {
		window.removeEventListener('deviceorientation', this.handleOrientationBound, true)
	}

	spawnAsteroid() {
		const x = Phaser.Math.Between(0, this.cameras.main.width)

		const asteroid = this.asteroids.create(x, 0, 'asteroid')
		asteroid.setVelocityY(Phaser.Math.Between(100, 200))
	}
}
